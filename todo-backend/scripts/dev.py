#!/usr/bin/env python3
"""Development script for the Todo API"""

import subprocess
import sys
from pathlib import Path

def run_command(cmd: list[str]) -> int:
    """Run a command and return its exit code"""
    print(f"Running: {' '.join(cmd)}")
    return subprocess.run(cmd).returncode

def main():
    """Main development script"""
    if len(sys.argv) < 2:
        print("Usage: python scripts/dev.py <command>")
        print("Commands:")
        print("  install    - Install dependencies")
        print("  dev        - Run development server")
        print("  format     - Format code with black and isort")
        print("  lint       - Run linting")
        print("  test       - Run tests")
        return 1

    command = sys.argv[1]
    
    if command == "install":
        # Install main dependencies
        main_deps = [
            "fastapi", "uvicorn[standard]", "sqlalchemy", "alembic", 
            "python-dotenv", "pydantic", "python-multipart", 
            "python-jose[cryptography]", "passlib[bcrypt]", "python-dateutil"
        ]
        exit_code = run_command(["uv", "pip", "install"] + main_deps)
        
        # Install dev dependencies
        dev_deps = ["pytest", "pytest-asyncio", "httpx", "black", "isort", "flake8"]
        exit_code += run_command(["uv", "pip", "install"] + dev_deps)
        
        return exit_code
    
    elif command == "dev":
        return run_command(["uv", "run", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0"])
    
    elif command == "format":
        exit_code = run_command(["uv", "run", "black", "."])
        exit_code += run_command(["uv", "run", "isort", "."])
        return exit_code
    
    elif command == "lint":
        return run_command(["uv", "run", "flake8", "app/"])
    
    elif command == "test":
        return run_command(["uv", "run", "pytest"])
    
    else:
        print(f"Unknown command: {command}")
        return 1

if __name__ == "__main__":
    sys.exit(main())