import { useState, useCallback, useEffect } from 'react'
import { useTodos } from './hooks/useTodos'
import { AddTodoForm } from './components/AddTodoForm'
import { TodoList } from './components/TodoList'
import { SearchBar } from './components/SearchBar'
import { TodoStats } from './components/TodoStats'
import { ApiTest } from './components/ApiTest'
import { Navigation } from './components/Navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

function App() {
  const {
    todos,
    loading,
    error,
    stats,
    filteredStats,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    searchTodos,
    moveTodo,
  } = useTodos()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeView, setActiveView] = useState('active') // Default to active items
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

  // Filter todos based on active view
  const filteredTodos = todos.filter(todo => {
    switch (activeView) {
      case 'active':
        return !todo.completed
      case 'completed':
        return todo.completed
      case 'overdue':
        return todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed
      case 'high-priority':
        return todo.priority === 'high'
      case 'today':
        if (!todo.due_date) return false
        const today = new Date().toISOString().split('T')[0]
        const todoDate = todo.due_date.split('T')[0]
        return todoDate === today
      case 'all':
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Navigation Sidebar */}
      <Navigation 
        activeView={activeView} 
        onViewChange={setActiveView} 
        stats={filteredStats}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-80 min-h-screen overflow-y-auto">
        <div className="p-4 lg:p-8">
          <div className="max-w-4xl mx-auto pt-16 lg:pt-8">
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

        {/* Stats - Show only when Statistics view is selected */}
        {activeView === 'stats' && <TodoStats stats={stats} />}

        {/* Add Todo Form - Hide when in stats view */}
        {activeView !== 'stats' && (
          <AddTodoForm onAdd={handleAddTodo} loading={isAddingTodo} />
        )}

        {/* Search - Hide when in stats view */}
        {activeView !== 'stats' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Todo List - Hide when in stats view */}
        {activeView !== 'stats' && (
          <TodoList
            todos={filteredTodos}
            loading={loading}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
            onMove={moveTodo}
            onCreateChild={createTodo}
          />
        )}

        {/* Empty State - Only for non-stats views */}
        {activeView !== 'stats' && !loading && filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {searchQuery ? 'No todos found' : getEmptyStateMessage(activeView)}
            </h3>
            <p className="text-gray-400">
              {searchQuery ? 'Try a different search term' : getEmptyStateSubtext(activeView)}
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for empty state messages
const getEmptyStateMessage = (view) => {
  switch (view) {
    case 'active': return 'No active todos'
    case 'completed': return 'No completed todos'
    case 'overdue': return 'No overdue todos'
    case 'high-priority': return 'No high priority todos'
    case 'today': return 'No todos due today'
    case 'stats': return 'Statistics View'
    default: return 'No todos yet'
  }
}

const getEmptyStateSubtext = (view) => {
  switch (view) {
    case 'active': return 'Great job! All your tasks are completed.'
    case 'completed': return 'Complete some tasks to see them here.'
    case 'overdue': return 'You\'re all caught up! No overdue tasks.'
    case 'high-priority': return 'No urgent tasks at the moment.'
    case 'today': return 'No tasks are due today.'
    case 'stats': return 'View your productivity statistics and insights.'
    default: return 'Add your first todo to get started!'
  }
}

export default App
