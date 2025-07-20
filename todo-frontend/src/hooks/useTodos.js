import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:8000/api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchTodos = useCallback(async () => {
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
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats/`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Calculate filtered stats based on current todos (excluding sub-items)
  const calculateFilteredStats = (todoList) => {
    // Only count root-level todos (parent_id is null)
    const rootTodos = todoList.filter(todo => !todo.parent_id);
    
    const total = rootTodos.length;
    const completed = rootTodos.filter(todo => todo.completed).length;
    const pending = rootTodos.filter(todo => !todo.completed).length;
    const overdue = rootTodos.filter(todo => 
      todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed
    ).length;
    
    // Calculate due today count
    const today = new Date().toISOString().split('T')[0];
    const dueToday = rootTodos.filter(todo => {
      if (!todo.due_date) return false;
      const todoDate = todo.due_date.split('T')[0];
      return todoDate === today;
    }).length;
    
    const by_priority = {
      high: rootTodos.filter(todo => todo.priority === 'high').length,
      medium: rootTodos.filter(todo => todo.priority === 'medium').length,
      low: rootTodos.filter(todo => todo.priority === 'low').length,
    };

    return {
      total,
      completed,
      pending,
      overdue,
      dueToday,
      by_priority
    };
  };

  const createTodo = async (todoData) => {
    try {
      console.log('Creating todo with data:', todoData);
      const response = await fetch(`${API_BASE}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to create todo: ${response.status} - ${errorText}`);
      }
      
      const newTodo = await response.json();
      console.log('Created todo:', newTodo);
      await fetchTodos();
      await fetchStats();
      return newTodo;
    } catch (err) {
      console.error('Create todo error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      await fetchTodos();
      await fetchStats();
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      await fetchTodos();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error('Failed to toggle todo');
      const updatedTodo = await response.json();
      await fetchTodos();
      await fetchStats();
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const searchTodos = useCallback(async (query) => {
    if (!query.trim()) {
      await fetchTodos();
      return;
    }
    
    // Don't show loading state for search to prevent UI flicker
    try {
      const response = await fetch(`${API_BASE}/search/?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [fetchTodos]);

  const moveTodo = async (id, newParentId) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_parent_id: newParentId }),
      });
      if (!response.ok) throw new Error('Failed to move todo');
      await fetchTodos();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, []);

  return {
    todos,
    loading,
    error,
    stats,
    filteredStats: calculateFilteredStats(todos),
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    searchTodos,
    moveTodo,
    fetchStats,
  };
};