# 🔧 FastAPI Backend Troubleshooting

## 🚨 Empty /docs Page Issue

If you see an empty page at http://localhost:8000/docs, try these steps:

### **Step 1: Check if Server is Running**
```bash
cd todo-backend

# Test if dependencies are installed
python test_server.py

# Start server with better error handling
python start_server.py
```

### **Step 2: Manual Server Start**
```bash
cd todo-backend

# Method 1: Direct Python
python -m app.main

# Method 2: Uvicorn command
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Method 3: With UV
uv run uvicorn app.main:app --reload
```

### **Step 3: Check Dependencies**
```bash
# Install missing dependencies
uv pip install fastapi uvicorn sqlalchemy python-dotenv pydantic python-multipart python-jose passlib python-dateutil alembic

# Or use the dev script
python scripts/dev.py install
```

### **Step 4: Test Endpoints**

Once server is running, test these URLs:

- **Health Check**: http://localhost:8000/health
- **Root**: http://localhost:8000/
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Todos API**: http://localhost:8000/api/todos/

### **Step 5: Check Console Output**

Look for these messages when starting:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
Database tables created successfully
```

## 🐛 Common Issues & Solutions

### **Issue 1: Import Errors**
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution:**
```bash
uv pip install fastapi uvicorn
```

### **Issue 2: Database Errors**
```
sqlite3.OperationalError: no such table: todos
```
**Solution:** Tables are created automatically on startup. Check console for errors.

### **Issue 3: Port Already in Use**
```
OSError: [Errno 48] Address already in use
```
**Solution:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn app.main:app --port 8001
```

### **Issue 4: CORS Errors**
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:** CORS is already configured. Check if backend is running.

## ✅ Success Indicators

When everything works correctly, you should see:

1. **Console Output:**
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   Database tables created successfully
   ```

2. **Health Check Response:**
   ```json
   {"status": "healthy", "message": "Todo API is running"}
   ```

3. **Swagger UI:** Interactive API documentation at /docs

4. **Database File:** `todos.db` created in project directory

## 🆘 Still Having Issues?

1. **Check Python Version:** Requires Python 3.8+
2. **Check Virtual Environment:** Make sure it's activated
3. **Check File Permissions:** Ensure you can write to the directory
4. **Check Firewall:** Port 8000 should be accessible
5. **Check Logs:** Look for error messages in console

## 🚀 Quick Reset

If all else fails, try a complete reset:

```bash
cd todo-backend

# Remove virtual environment
rm -rf .venv

# Remove database
rm -f todos.db

# Fresh start
uv venv
source .venv/bin/activate
python scripts/dev.py install
python start_server.py
```