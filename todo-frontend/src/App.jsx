import { useState, useCallback } from 'react'
import { useTodos } from './hooks/useTodos'
import { AddTodoForm } from './components/AddTodoForm'
import { TodoList } from './components/TodoList'
import { SearchBar } from './components/SearchBar'
import { TodoStats } from './components/TodoStats'
import { FilterTabs } from './components/FilterTabs'
import { ApiTest } from './components/ApiTest'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

function App() {
  const {
    todos,
    loading,
    error,
    stats,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    searchTodos,
    moveTodo,
  } = useTodos()

  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed
  const [isAddingTodo, setIsAddingTodo] = useState(false)

  const handleAddTodo = async (todoData) => {
    setIsAddingTodo(true)
    try {
      await createTodo(todoData)
    } finally {
      setIsAddingTodo(false)
    }
  }

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query)
    await searchTodos(query)
  }, [searchTodos])

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircleIcon className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Modern Todo</h1>
          </div>
          <p className="text-gray-600 text-lg">Stay organized and productive</p>
        </div>

        {/* API Test (show if there are errors) */}
        {error && <ApiTest />}

        {/* Stats */}
        {stats && <TodoStats stats={stats} />}

        {/* Add Todo Form */}
        <AddTodoForm onAdd={handleAddTodo} loading={isAddingTodo} />

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
            <div className="sm:w-auto">
              <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Todo List */}
        <TodoList
          todos={filteredTodos}
          loading={loading}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onMove={moveTodo}
          onCreateChild={createTodo}
        />

        {/* Empty State */}
        {!loading && filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {searchQuery ? 'No todos found' : filter === 'completed' ? 'No completed todos' : filter === 'active' ? 'No active todos' : 'No todos yet'}
            </h3>
            <p className="text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Add your first todo to get started!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
