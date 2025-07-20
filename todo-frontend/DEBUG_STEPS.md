# 🐛 Debug Steps for "Failed to create todo" Error

## 🔍 Step 1: Check Backend Server

First, make sure the backend server is running:

```bash
cd todo-backend
python start_server.py
```

You should see output like:
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

## 🔍 Step 2: Test API Endpoints Manually

Open your browser and test these URLs:

1. **Health Check**: http://localhost:8000/health
   - Should show: `{"status": "healthy"}`

2. **API Docs**: http://localhost:8000/docs
   - Should show Swagger UI interface

3. **Get Todos**: http://localhost:8000/api/todos/
   - Should show: `[]` (empty array) or existing todos

## 🔍 Step 3: Use the Built-in API Test

I've added an API test component to the frontend. When you see the error:

1. The **API Test** panel will appear automatically
2. Click **"Test API Connection"** button
3. Review the detailed logs to see exactly what's failing

## 🔍 Step 4: Check Browser Console

Open browser DevTools (F12) and look for:

1. **Console tab** - Check for error messages
2. **Network tab** - Look at failed requests
3. **Response details** - See exact error messages from server

## 🔍 Step 5: Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptoms**: Connection refused, network errors
**Solution**: Start the backend server

### Issue 2: CORS Error
**Symptoms**: "Access to fetch blocked by CORS policy"
**Solution**: Backend should allow `http://localhost:5173`

### Issue 3: Wrong API URL
**Symptoms**: 404 Not Found errors
**Solution**: Check API_BASE in `useTodos.js` is `http://localhost:8000/api/todos`

### Issue 4: Invalid Request Data
**Symptoms**: 422 Unprocessable Entity
**Solution**: Check the request body format matches API expectations

### Issue 5: Port Conflicts
**Symptoms**: Backend won't start or frontend can't connect
**Solution**: Check if ports 8000 (backend) and 5173 (frontend) are available

## 🔍 Step 6: Manual API Test with curl

Test the create todo endpoint directly:

```bash
curl -X POST "http://localhost:8000/api/todos/" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test Todo",
    "priority": "medium"
  }'
```

Expected response (status 201):
```json
{
  "id": 1,
  "text": "Test Todo",
  "completed": false,
  "priority": "medium",
  "parent_id": null,
  "created_at": "2024-01-01T12:00:00",
  "updated_at": "2024-01-01T12:00:00",
  "children_count": 0
}
```

## 🔍 Step 7: Check Request Format

The frontend sends this data format:
```javascript
{
  text: "Todo text",
  priority: "medium",
  due_date: null,
  parent_id: null  // for subtasks
}
```

Make sure this matches what the backend expects.

## 🔍 Step 8: Enable Detailed Logging

I've added console logging to the `createTodo` function. Check the browser console for:

- "Creating todo with data: ..." - Shows request data
- "Response status: ..." - Shows HTTP status code  
- "API Error: ..." - Shows server error response
- "Created todo: ..." - Shows successful response

## 🆘 If All Else Fails

1. **Restart both servers**
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Check firewall/antivirus** blocking connections
4. **Try a different browser**
5. **Check if another app is using port 8000**

The API test component will help identify the exact issue!