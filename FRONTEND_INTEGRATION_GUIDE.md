# Todo Backend API 集成文档

## 概述

这是一个基于 FastAPI 构建的 Todo 应用后端 API，支持嵌套子任务、搜索、统计等功能。本文档提供前端集成所需的所有信息。

## 服务器信息

- **基础URL**: `http://localhost:8000`
- **API前缀**: `/api/todos`
- **文档地址**: `http://localhost:8000/docs` (Swagger UI)
- **ReDoc文档**: `http://localhost:8000/redoc`
- **健康检查**: `http://localhost:8000/health`

## 启动服务器

```bash
cd todo-backend
python start_server.py
```

默认运行在 `http://localhost:8000`

## CORS 配置

服务器已配置 CORS，默认允许的前端地址：
- `http://localhost:5173` (Vite 默认端口)
- `http://localhost:3000` (React 默认端口)

## 数据模型

### Todo 对象结构

```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  due_date?: string | null;  // ISO 8601 格式
  priority: "low" | "medium" | "high";
  parent_id?: number | null;
  user_id?: number | null;
  created_at: string;        // ISO 8601 格式
  updated_at: string;        // ISO 8601 格式
  children_count: number;
  children?: Todo[];         // 嵌套结构时包含
}
```

### 优先级枚举

```typescript
type Priority = "low" | "medium" | "high";
```

## API 端点详情

### 1. 获取所有 Todos

**GET** `/api/todos/`

**查询参数:**
- `skip` (int, 可选): 跳过的记录数，默认 0
- `limit` (int, 可选): 返回的最大记录数，默认 100，最大 1000
- `parent_id` (int, 可选): 按父级 ID 过滤 (null 表示根级别)
- `completed` (bool, 可选): 按完成状态过滤
- `priority` (string, 可选): 按优先级过滤 ("low", "medium", "high")
- `nested` (bool, 可选): 是否返回嵌套结构，默认 true

**响应:** `Todo[]`

**示例请求:**
```javascript
// 获取所有根级别的 todos（带嵌套结构）
fetch('http://localhost:8000/api/todos/')

// 获取未完成的 todos
fetch('http://localhost:8000/api/todos/?completed=false')

// 获取高优先级的 todos
fetch('http://localhost:8000/api/todos/?priority=high')

// 获取扁平列表（不嵌套）
fetch('http://localhost:8000/api/todos/?nested=false')
```

### 2. 获取单个 Todo

**GET** `/api/todos/{todo_id}`

**路径参数:**
- `todo_id` (int): Todo ID

**响应:** `Todo`

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/1')
```

### 3. 创建新 Todo

**POST** `/api/todos/`

**请求体:**
```typescript
interface TodoCreate {
  text: string;                    // 必需，1-500字符
  completed?: boolean;             // 可选，默认 false
  due_date?: string | null;        // 可选，ISO 8601 格式
  priority?: "low" | "medium" | "high"; // 可选，默认 "medium"
  parent_id?: number | null;       // 可选，父级 Todo ID
}
```

**响应:** `Todo` (状态码 201)

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: '完成项目文档',
    priority: 'high',
    due_date: '2024-12-31T23:59:59'
  })
})
```

### 4. 更新 Todo

**PUT** `/api/todos/{todo_id}`

**路径参数:**
- `todo_id` (int): Todo ID

**请求体:**
```typescript
interface TodoUpdate {
  text?: string;                   // 可选，1-500字符
  completed?: boolean;             // 可选
  due_date?: string | null;        // 可选，ISO 8601 格式
  priority?: "low" | "medium" | "high"; // 可选
  parent_id?: number | null;       // 可选，父级 Todo ID
}
```

**响应:** `Todo`

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: '更新后的任务描述',
    completed: true
  })
})
```

### 5. 删除 Todo

**DELETE** `/api/todos/{todo_id}`

**路径参数:**
- `todo_id` (int): Todo ID

**响应:** `{"message": "Todo deleted successfully"}`

**注意:** 删除父级 Todo 会级联删除所有子 Todo

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/1', {
  method: 'DELETE'
})
```

### 6. 切换完成状态

**PATCH** `/api/todos/{todo_id}/toggle`

**路径参数:**
- `todo_id` (int): Todo ID

**请求体:**
```typescript
interface ToggleCompletionRequest {
  completed: boolean;  // 新的完成状态
}
```

**响应:** `Todo`

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/1/toggle', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    completed: true
  })
})
```

### 7. 获取子 Todos

**GET** `/api/todos/{todo_id}/children`

**路径参数:**
- `todo_id` (int): 父级 Todo ID

**响应:** `Todo[]`

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/1/children')
```

### 8. 移动 Todo

**POST** `/api/todos/{todo_id}/move`

**路径参数:**
- `todo_id` (int): 要移动的 Todo ID

**请求体:**
```typescript
interface MoveRequest {
  new_parent_id?: number | null;  // 新父级 ID，null 表示移动到根级别
}
```

**响应:** `Todo`

**示例请求:**
```javascript
// 移动到另一个父级下
fetch('http://localhost:8000/api/todos/1/move', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    new_parent_id: 2
  })
})

// 移动到根级别
fetch('http://localhost:8000/api/todos/1/move', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    new_parent_id: null
  })
})
```

### 9. 搜索 Todos

**GET** `/api/todos/search/`

**查询参数:**
- `q` (string, 必需): 搜索关键词，最少1个字符
- `skip` (int, 可选): 跳过的记录数，默认 0
- `limit` (int, 可选): 返回的最大记录数，默认 100，最大 1000

**响应:** `Todo[]`

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/search/?q=项目')
```

### 10. 获取统计信息

**GET** `/api/todos/stats/`

**响应:**
```typescript
interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  by_priority: {
    low: number;
    medium: number;
    high: number;
  };
}
```

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/stats/')
```

### 11. 批量删除 Todos

**DELETE** `/api/todos/bulk/`

**请求体:**
```typescript
interface BulkDeleteRequest {
  ids: number[];  // 要删除的 Todo ID 列表，至少1个
}
```

**响应:** `{"message": "Deleted X todos", "deleted_count": number}`

**示例请求:**
```javascript
fetch('http://localhost:8000/api/todos/bulk/', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ids: [1, 2, 3]
  })
})
```

## 错误处理

API 使用标准 HTTP 状态码：

- `200` - 成功
- `201` - 创建成功
- `400` - 请求错误（如验证失败）
- `404` - 资源不存在
- `500` - 服务器内部错误

**错误响应格式:**
```typescript
interface ErrorResponse {
  error: string;
  detail?: string;
  status_code: number;
}
```

**常见错误示例:**
```json
{
  "error": "Todo not found",
  "status_code": 404
}

{
  "error": "Validation error",
  "detail": "Text field is required",
  "status_code": 400
}
```

## 前端集成示例

### React Hook 示例

```typescript
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api/todos';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  due_date?: string | null;
  priority: 'low' | 'medium' | 'high';
  parent_id?: number | null;
  user_id?: number | null;
  created_at: string;
  updated_at: string;
  children_count: number;
  children?: Todo[];
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData: {
    text: string;
    priority?: 'low' | 'medium' | 'high';
    parent_id?: number | null;
  }) => {
    try {
      const response = await fetch(`${API_BASE}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });
      if (!response.ok) throw new Error('Failed to create todo');
      const newTodo = await response.json();
      await fetchTodos(); // 重新获取列表
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      await fetchTodos(); // 重新获取列表
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      await fetchTodos(); // 重新获取列表
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error('Failed to toggle todo');
      const updatedTodo = await response.json();
      await fetchTodos(); // 重新获取列表
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};
```

### Axios 配置示例

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/todos',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
```

## 开发建议

1. **错误处理**: 始终处理 API 错误，向用户显示友好的错误消息
2. **加载状态**: 在 API 调用期间显示加载指示器
3. **乐观更新**: 对于快速操作（如切换完成状态），可以先更新 UI，然后调用 API
4. **缓存**: 考虑使用 React Query 或 SWR 来管理服务器状态和缓存
5. **类型安全**: 使用 TypeScript 确保类型安全
6. **环境变量**: 将 API 基础 URL 配置为环境变量

## 测试

后端提供了测试脚本，可以验证 API 功能：

```bash
cd todo-backend
python test_server.py
```

## 部署注意事项

1. **CORS**: 生产环境中需要配置正确的 CORS 允许源
2. **数据库**: 生产环境建议使用 PostgreSQL 或 MySQL
3. **环境变量**: 配置生产环境的环境变量
4. **HTTPS**: 生产环境使用 HTTPS

---

这份文档涵盖了前端集成所需的所有信息。如有疑问，请查看 Swagger 文档 (`http://localhost:8000/docs`) 获取更多详细信息。