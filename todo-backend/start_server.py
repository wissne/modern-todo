#!/usr/bin/env python3
"""Simple script to start the FastAPI server with better error handling"""

import sys
import os
import subprocess

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'fastapi', 'uvicorn', 'sqlalchemy', 'python-dotenv', 'pydantic'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} is missing")
    
    if missing_packages:
        print(f"\n🔧 Install missing packages:")
        print(f"uv pip install {' '.join(missing_packages)}")
        return False
    
    return True

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    
    try:
        # Try to start with uvicorn directly
        cmd = [
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ]
        
        print(f"Running: {' '.join(cmd)}")
        subprocess.run(cmd, cwd=os.path.dirname(os.path.abspath(__file__)))
        
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("\n🔧 Try manual start:")
        print("python -m app.main")

if __name__ == "__main__":
    print("🧪 FastAPI Server Startup Check")
    print("=" * 40)
    
    if check_dependencies():
        print("\n✅ All dependencies are installed!")
        start_server()
    else:
        print("\n❌ Please install missing dependencies first")
        sys.exit(1)