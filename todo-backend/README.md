# 📋 Todo API Backend
# todo-backend

## 项目简介
本项目为待办事项应用的后端，基于 Python 构建，采用 FastAPI 框架，支持任务的增删改查、子任务管理、数据持久化等功能。可与前端（todo-frontend）配合，实现完整的任务管理系统。

## 主要功能
- 创建、查询、更新、删除待办事项
- 支持任务子项（子任务）
- RESTful API 设计，易于前后端集成
- 数据持久化（SQLite 数据库）
- 任务状态、日期等筛选

## 目录结构
```
todo-backend/
  app/
    __init__.py
    crud.py         # 业务逻辑
    database.py     # 数据库连接
    main.py         # FastAPI 入口
    models.py       # ORM模型
    schemas.py      # 数据结构定义
    routers/
      __init__.py
      todos.py      # 路由定义
- AI 智能子任务生成（如 generate_ai_subtasks）
  scripts/
    dev.py          # 开发辅助脚本
  start_server.py   # 启动脚本
  test_server.py    # 测试脚本
  todos.db          # SQLite数据库文件
  Dockerfile        # Docker 构建
  docker-compose.yml
-
### 典型接口
- `GET /api/todos/`：获取所有待办事项（支持嵌套/筛选）
- `POST /api/todos/`：新建待办事项
- `PUT /api/todos/{todo_id}`：更新待办事项
- `DELETE /api/todos/{todo_id}`：删除待办事项及其子项
- `PATCH /api/todos/{todo_id}/toggle`：切换完成状态
- `GET /api/todos/{todo_id}/children`：获取某待办的直接子项
- `POST /api/todos/{todo_id}/move`：移动待办到其他父项
- `GET /api/todos/search/`：文本搜索待办事项
- `GET /api/todos/stats/`：获取统计信息
- `DELETE /api/todos/bulk/`：批量删除
- `POST /api/todos/{todo_id}/ai-subtasks`：AI 智能生成子任务

#### AI 子任务生成接口
`POST /api/todos/{todo_id}/ai-subtasks`
- 说明：为指定待办事项自动生成若干子任务（如分解复杂任务、智能规划步骤）。
- 参数：`max_subtasks`（可选，默认5，最大10）
- 返回：生成的子任务列表及提示信息
- 示例：
```bash
curl -X POST "http://localhost:8000/api/todos/123/ai-subtasks?max_subtasks=5"
```
返回：
```
{
  "parent_todo_id": 123,
  "generated_subtasks": [ ... ],
  "message": "Generated 5 AI subtasks for 'xxx'"
}
```
  pyproject.toml    # 项目依赖
  uv.lock           # uv 工具锁文件
  README.md         # 项目说明
```

## 快速开始

### 使用 uv 工具
1. 安装依赖
   ```bash
   uv sync
   ```
2. 启动开发服务器
   ```bash
   uvicorn app.main:app --reload
   # 或使用脚本
   uv run start_server.py
   ```
3. 访问 API 文档
   打开浏览器访问 [http://localhost:8000/docs](http://localhost:8000/docs)

### 使用 Docker
1. 构建镜像
   ```bash
   docker build -t todo-backend .
   ```
2. 启动服务
   ```bash
   docker-compose up
   ```

## API 说明
- 所有接口均为 RESTful 风格，详见 `/docs` 自动生成文档。
- 主要路由定义在 `app/routers/todos.py`。

## 测试
运行测试脚本：
```bash
uv run test_server.py
```

## 其他
- 如遇依赖或环境问题，请参考 `TROUBLESHOOTING.md`。
- 支持 Docker 部署，便于生产环境集成。

---

如需定制或扩展功能，请参考各模块源码及 FastAPI 官方文档。
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