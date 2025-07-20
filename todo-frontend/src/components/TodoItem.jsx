import { useState } from 'react';
import { 
  CheckCircleIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { TodoForm } from './TodoForm';
import { ConfirmDialog, NotificationToast } from './ConfirmDialog';
import { formatDate } from '../utils/dateUtils';
import { transitionTodoUpdate } from '../utils/viewTransitions';

export const TodoItem = ({ todo, onToggle, onUpdate, onDelete, onMove, onCreateChild, onGenerateAISubtasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAIConfirm, setShowAIConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ title: '', message: '', type: 'success' });

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;

  const handleToggle = async () => {
    setLoading(true);
    try {
      transitionTodoUpdate(() => {
        // The actual state update will happen in the parent component
      });
      // 完成当前item
      await onToggle(todo.id, !todo.completed);
      // 如果有子任务，递归完成所有子任务
      if (todo.children && todo.children.length > 0) {
        for (const child of todo.children) {
          if (!child.completed) {
            await onToggle(child.id, true);
          }
          // 递归处理子子任务
          if (child.children && child.children.length > 0) {
            const completeChildren = async (children) => {
              for (const c of children) {
                if (!c.completed) {
                  await onToggle(c.id, true);
                }
                if (c.children && c.children.length > 0) {
                  await completeChildren(c.children);
                }
              }
            };
            await completeChildren(child.children);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(todo.id);
      setNotification({
        title: 'Todo Deleted',
        message: 'Todo has been successfully deleted.',
        type: 'success'
      });
      setShowNotification(true);
    } catch (error) {
      setNotification({
        title: 'Delete Failed',
        message: 'Failed to delete todo. Please try again.',
        type: 'error'
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updates) => {
    setLoading(true);
    try {
      await onUpdate(todo.id, updates);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChild = async (childData) => {
    setLoading(true);
    try {
      await onCreateChild({ ...childData, parent_id: todo.id });
      setIsAddingChild(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAISubtasks = async () => {
    console.log('AI button clicked for todo:', todo.id);
    console.log('onGenerateAISubtasks function:', onGenerateAISubtasks);
    
    if (!onGenerateAISubtasks) {
      setNotification({
        title: 'AI Function Not Available',
        message: 'The AI subtask generation feature is not properly connected. Please check the console for technical details.',
        type: 'error'
      });
      setShowNotification(true);
      console.error('onGenerateAISubtasks is not defined');
      return;
    }
    
    setShowAIConfirm(true);
  };

  const confirmAIGeneration = async () => {
    setLoading(true);
    try {
      console.log('Calling AI subtasks API...');
      const result = await onGenerateAISubtasks(todo.id, 5);
      console.log('AI result:', result);
      
      setNotification({
        title: 'AI Subtasks Generated!',
        message: `Successfully generated ${result.generated_subtasks.length} intelligent subtasks for "${todo.text}".`,
        type: 'success'
      });
      setShowNotification(true);
    } catch (error) {
      console.error('AI generation error:', error);
      setNotification({
        title: 'AI Generation Failed',
        message: `Failed to generate AI subtasks: ${error.message}`,
        type: 'error'
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const priorityConfig = {
    high: { 
      label: 'High Priority', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    medium: { 
      label: 'Medium Priority', 
      bgColor: 'bg-yellow-50', 
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    },
    low: { 
      label: 'Low Priority', 
      bgColor: 'bg-green-50', 
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    }
  };

  const priority = priorityConfig[todo.priority];

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border-2 border-gray-100 p-4 transition-all duration-300 hover:shadow-lg hover:border-gray-200 ${
        todo.completed ? 'opacity-75 bg-gray-50' : ''
      }`}
      style={{ viewTransitionName: `todo-${todo.id}` }}
    >
      <div className="flex items-start gap-4">
        {/* Enhanced Checkbox */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white shadow-lg'
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
          }`}
        >
          {todo.completed ? (
            <CheckCircleIconSolid className="w-4 h-4" />
          ) : (
            <CheckCircleIcon className="w-4 h-4 opacity-0 group-hover:opacity-50" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <TodoForm
              todo={todo}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              loading={loading}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className={`text-lg font-semibold leading-tight ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.text}
                </h3>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Priority Badge */}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${priority.bgColor} ${priority.textColor} ${priority.borderColor}`}>
                    {priority.label}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={loading}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      title="Edit todo"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setIsAddingChild(true)}
                      disabled={loading}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      title="Add subtask"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    
                    {/* AI Generate Button */}
                    <button
                      onClick={handleGenerateAISubtasks}
                      disabled={loading || todo.children_count > 0}
                      className="p-2 text-purple-600 bg-purple-100 hover:text-purple-700 hover:bg-purple-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-300"
                      title={todo.children_count > 0 ? "AI subtasks disabled (already has subtasks)" : "Generate AI subtasks"}
                    >
                      <SparklesIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={loading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete todo"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Due Date with enhanced styling */}
              {todo.due_date && (
                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg ${
                  isOverdue 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {isOverdue ? (
                    <ExclamationTriangleIcon className="w-4 h-4" />
                  ) : (
                    <CalendarIcon className="w-4 h-4" />
                  )}
                  <span>
                    Due: {formatDate(todo.due_date)}
                    {isOverdue && ' (Overdue!)'}
                  </span>
                </div>
              )}

              {/* Enhanced Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>Created {formatDate(todo.created_at)}</span>
                </div>
                {todo.updated_at !== todo.created_at && (
                  <div className="flex items-center gap-1">
                    <PencilIcon className="w-3 h-3" />
                    <span>Updated {formatDate(todo.updated_at)}</span>
                  </div>
                )}
                {todo.children_count > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {todo.children_count}
                    </span>
                    <span>subtask{todo.children_count > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Child Form */}
      {isAddingChild && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Add Subtask</h4>
          <TodoForm
            onSave={handleCreateChild}
            onCancel={() => setIsAddingChild(false)}
            loading={loading}
          />
        </div>
      )}

      {/* Enhanced Children/Subtasks */}
      {todo.children && todo.children.length > 0 && (
        <div className="mt-6 pl-6 border-l-4 border-indigo-200 bg-gradient-to-r from-indigo-50 to-transparent rounded-r-lg">
          <div className="space-y-3 py-3">
            {todo.children.map((child) => (
              <TodoItem
                key={child.id}
                todo={child}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onMove={onMove}
                onCreateChild={onCreateChild}
                onGenerateAISubtasks={onGenerateAISubtasks}
              />
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Todo"
        message={`Are you sure you want to delete "${todo.text}"? This action cannot be undone and will also delete all subtasks.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
      />

      <ConfirmDialog
        isOpen={showAIConfirm}
        onClose={() => setShowAIConfirm(false)}
        onConfirm={confirmAIGeneration}
        title="Generate AI Subtasks"
        message={`Generate intelligent subtasks for "${todo.text}"? This will analyze your todo and create relevant sub-tasks to help you break it down into manageable steps.`}
        confirmText="Generate AI Subtasks"
        cancelText="Cancel"
        type="info"
      />

      {/* Notification Toast */}
      <NotificationToast
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};