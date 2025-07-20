import { useState, useCallback, useEffect } from 'react'
import { useTodos } from './hooks/useTodos'
import { AddTodoForm } from './components/AddTodoForm'
import { TodoList } from './components/TodoList'
import { SearchBar } from './components/SearchBar'
import { TodoStats } from './components/TodoStats'
import { ApiTest } from './components/ApiTest'
import { Navigation } from './components/Navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { transitionViewChange, transitionNavigation } from './utils/viewTransitions'

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
    generateAISubtasks,
  } = useTodos()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeView, setActiveView] = useState('active') // Default to active items
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true) // Navigation visibility state
  const [sortType, setSortType] = useState('default')
  const [orderType, setOrderType] = useState('asc')

  const handleAddTodo = async (todoData) => {
    setIsAddingTodo(true)
    try {
      await createTodo(todoData)
    } finally {
      setIsAddingTodo(false)
    }
  }

  const handleSearch = useCallback(async (query) => {
    transitionViewChange(() => {
      setSearchQuery(query)
    })
    await searchTodos(query)
  }, [searchTodos])

  const handleViewChange = (newView) => {
    transitionViewChange(() => {
      setActiveView(newView)
    })
  }

  const handleNavToggle = () => {
    transitionNavigation(() => {
      setIsNavVisible(!isNavVisible)
    })
  }

  // Filter todos based on active view
  let filteredTodos = todos.filter(todo => {
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

  // 排序逻辑
  const sortFn = {
    created: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    priority: (a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    },
    due: (a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    },
    completed: (a, b) => Number(a.completed) - Number(b.completed),
    default: () => 0
  };
  if (sortType !== 'default') {
    filteredTodos = [...filteredTodos].sort(sortFn[sortType] || sortFn['default']);
    if (orderType === 'desc') {
      filteredTodos.reverse();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Navigation Toggle Button */}
      <button
        onClick={handleNavToggle}
        className={`hidden lg:block fixed top-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-xl ${isNavVisible ? 'left-[336px]' : 'left-4'
          }`}
        title={isNavVisible ? 'Hide Navigation' : 'Show Navigation'}
        style={{ viewTransitionName: 'nav-toggle' }}
      >
        {isNavVisible ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Navigation Sidebar */}
      <Navigation
        activeView={activeView}
        onViewChange={handleViewChange}
        stats={filteredStats}
        isVisible={isNavVisible}
      />

      {/* Main Content */}
      <div 
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-500 ease-out ${isNavVisible ? 'lg:ml-80' : 'lg:ml-0'
        }`}
        style={{ viewTransitionName: 'main-content' }}
      >
        <div className="p-2 lg:p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div 
              className="text-center mb-4"
              style={{ viewTransitionName: 'app-header' }}
            >
              <div 
                className="flex items-center justify-center gap-2 mb-2"
                style={{ viewTransitionName: 'header-title' }}
              >
                <CheckCircleIcon className="w-8 h-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-800">Modern Todo</h1>
              </div>
              <p 
                className="text-gray-600 text-sm"
                style={{ viewTransitionName: 'header-subtitle' }}
              >
                Stay organized and productive
              </p>
            </div>

            {/* API Test (show if there are errors) */}
            {error && <ApiTest />}

            {/* Stats - Show only when Statistics view is selected */}
            {activeView === 'stats' && (
              <div style={{ viewTransitionName: 'stats-content' }}>
                <TodoStats stats={stats} />
              </div>
            )}

            {/* Add Todo Form - Hide when in stats view */}
            {activeView !== 'stats' && (
              <div style={{ viewTransitionName: 'add-todo-form' }}>
                <AddTodoForm onAdd={handleAddTodo} loading={isAddingTodo} />
              </div>
            )}

            {/* Search + Sort - Hide when in stats view */}
            {activeView !== 'stats' && (
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6"
                style={{ viewTransitionName: 'search-bar' }}
              >
                <SearchBar 
                  onSearch={handleSearch} 
                  loading={loading} 
                  sortType={sortType} 
                  onSortChange={setSortType} 
                  orderType={orderType}
                  onOrderChange={setOrderType}
                />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
                <p className="font-medium text-sm">Error: {error}</p>
              </div>
            )}

            {/* Todo List - Hide when in stats view */}
            {activeView !== 'stats' && (
              <div style={{ viewTransitionName: 'todo-list' }}>
                <TodoList
                  todos={filteredTodos}
                  loading={loading}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                  onMove={moveTodo}
                  onCreateChild={createTodo}
                  onGenerateAISubtasks={generateAISubtasks}
                />
              </div>
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
