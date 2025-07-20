#!/usr/bin/env python3
"""Simple test to check if FastAPI server starts correctly"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing FastAPI imports...")
    from app.main import app
    print("✅ FastAPI app imported successfully")
    
    print("Testing database connection...")
    from app.database import create_tables
    create_tables()
    print("✅ Database tables created successfully")
    
    print("Testing API routes...")
    from app.routers import todos
    print("✅ Todo routes imported successfully")
    
    print("\n🎉 All imports successful! Try running:")
    print("python -m app.main")
    print("or")
    print("uvicorn app.main:app --reload")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you've installed all dependencies:")
    print("uv pip install fastapi uvicorn sqlalchemy python-dotenv pydantic")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("Check your code for syntax errors")

if __name__ == "__main__":
    print("FastAPI Test Complete")