# 📋 Todo API Backend

A comprehensive FastAPI backend for a todo application with nested sub-todos support.

## 🚀 Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete todos
- 🌳 **Nested Todos** - Unlimited levels of sub-todos
- 🔍 **Search** - Search todos by text content
- 📊 **Statistics** - Get completion and priority statistics
- 🔄 **Bulk Operations** - Delete multiple todos at once
- 📱 **CORS Support** - Ready for React frontend
- 📚 **Auto Documentation** - Swagger UI and ReDoc
- 🛡️ **Input Validation** - Pydantic schemas with validation
- 🗄️ **SQLite** - Lightweight database with relationships (no setup required)

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- UV (install from https://docs.astral.sh/uv/getting-started/installation/)

### Setup

1. **Install UV (if not already installed):**
```bash
# On macOS and Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows:
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or with pip:
pip install uv
```

2. **Clone and navigate to backend:**
```bash
cd todo-backend
```

3. **Create virtual environment and install dependencies:**
```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r pyproject.toml
```

4. **Configure environment (optional):**
```bash
cp .env.example .env
# SQLite database will be created automatically as todos.db
```

5. **Run the application:**
```bash
python -m app.main
# Or
uvicorn app.main:app --reload
```

The SQLite database file `todos.db` will be created automatically in the project directory.

### Alternative Quick Start (Simple):
```bash
cd todo-backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install fastapi uvicorn sqlalchemy alembic python-dotenv pydantic python-multipart python-jose passlib python-dateutil
python -m app.main
```

## 🌐 API Endpoints

### Base URL: `http://localhost:8000`

### **Todos**
- `GET /api/todos/` - Get all todos (with nested structure)
- `GET /api/todos/{id}` - Get specific todo with children
- `POST /api/todos/` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo and children
- `PATCH /api/todos/{id}/toggle` - Toggle completion status

### **Hierarchy Operations**
- `GET /api/todos/{id}/children` - Get direct children
- `POST /api/todos/{id}/move` - Move todo to different parent

### **Search & Analytics**
- `GET /api/todos/search/?q=term` - Search todos
- `GET /api/todos/stats/` - Get statistics
- `DELETE /api/todos/bulk/` - Bulk delete todos

### **Utility**
- `GET /health` - Health check
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

## 📝 API Usage Examples

### Create a Todo
```bash
curl -X POST "http://localhost:8000/api/todos/" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Complete project",
    "priority": "high",
    "due_date": "2024-12-31T23:59:59"
  }'
```

### Create a Sub-Todo
```bash
curl -X POST "http://localhost:8000/api/todos/" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Design phase",
    "parent_id": 1,
    "priority": "medium"
  }'
```

### Get All Todos (Nested)
```bash
curl "http://localhost:8000/api/todos/"
```

### Search Todos
```bash
curl "http://localhost:8000/api/todos/search/?q=project"
```

### Get Statistics
```bash
curl "http://localhost:8000/api/todos/stats/"
```

## 🗄️ Database Schema

```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATETIME,
    priority VARCHAR(10) DEFAULT 'medium',
    parent_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Response Examples

### Todo Response
```json
{
  "id": 1,
  "text": "Complete project",
  "completed": false,
  "due_date": "2024-12-31T23:59:59",
  "priority": "high",
  "parent_id": null,
  "user_id": null,
  "created_at": "2024-01-01T10:00:00",
  "updated_at": "2024-01-01T10:00:00",
  "children_count": 2
}
```

### Nested Todo Response
```json
{
  "id": 1,
  "text": "Complete project",
  "completed": false,
  "children": [
    {
      "id": 2,
      "text": "Design phase",
      "completed": true,
      "children": []
    },
    {
      "id": 3,
      "text": "Development phase",
      "completed": false,
      "children": [
        {
          "id": 4,
          "text": "Setup backend",
          "completed": true,
          "children": []
        }
      ]
    }
  ]
}
```

### Statistics Response
```json
{
  "total": 50,
  "completed": 30,
  "pending": 20,
  "overdue": 5,
  "by_priority": {
    "high": 10,
    "medium": 25,
    "low": 15
  }
}
```

## 🔧 Configuration

### Environment Variables (.env)
```env
DATABASE_URL=sqlite:///./todos.db
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🧪 Testing

### Manual Testing
1. Start the server: `python -m app.main` or `uv run python -m app.main`
2. Visit: `http://localhost:8000/docs`
3. Use the interactive Swagger UI to test endpoints

### Development Scripts
```bash
# Quick development commands
python scripts/dev.py install    # Install all dependencies
python scripts/dev.py dev        # Run development server
python scripts/dev.py format     # Format code
python scripts/dev.py lint       # Run linting
python scripts/dev.py test       # Run tests
```

### Using curl
```bash
# Health check
curl http://localhost:8000/health

# Create todo
curl -X POST http://localhost:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Test todo", "priority": "high"}'

# Get all todos
curl http://localhost:8000/api/todos/
```

### Development with UV
```bash
# Install development dependencies
uv pip install -r pyproject.toml --extra dev

# Run with auto-reload
uv run uvicorn app.main:app --reload

# Format code
uv run black .
uv run isort .

# Run tests
uv run pytest
```

## 🚀 Deployment

### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using Railway/Heroku
1. Add `Procfile`: `web: uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Set environment variables in platform dashboard
3. Deploy from Git repository

## 🔗 Integration with Frontend

This backend is designed to work with the React todo frontend. Update your frontend API calls to use:

```javascript
// Replace JSON Server calls
const API_BASE_URL = 'http://localhost:8000/api/todos';

// Get todos
const response = await fetch(`${API_BASE_URL}/`);
const todos = await response.json();

// Create todo
const response = await fetch(`${API_BASE_URL}/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(todoData)
});
```

## 📚 API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development!