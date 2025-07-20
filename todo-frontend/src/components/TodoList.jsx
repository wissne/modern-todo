import { TodoItem } from './TodoItem'
import { Loader2 } from 'lucide-react'

export const TodoList = ({ 
  todos, 
  loading, 
  onToggle, 
  onUpdate, 
  onDelete, 
  onMove,
  onCreateChild,
  onGenerateAISubtasks
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading todos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={onMove}
          onCreateChild={onCreateChild}
          onGenerateAISubtasks={onGenerateAISubtasks}
        />
      ))}
    </div>
  )
}