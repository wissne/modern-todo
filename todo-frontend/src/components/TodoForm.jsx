import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const TodoForm = ({ todo, onSave, onCancel, loading }) => {
  const [text, setText] = useState(todo?.text || '');
  const [priority, setPriority] = useState(todo?.priority || 'medium');
  // Convert datetime back to date for the input field, default to today for new todos
  const [dueDate, setDueDate] = useState(
    todo?.due_date ? todo.due_date.split('T')[0] : new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Convert date to datetime format if provided
    let formattedDueDate = null;
    if (dueDate) {
      // Add time component to make it a valid datetime (end of day)
      formattedDueDate = `${dueDate}T23:59:59`;
    }

    const todoData = {
      text: text.trim(),
      priority,
      due_date: formattedDueDate,
    };

    onSave(todoData);
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', emoji: '🟢' },
    { value: 'medium', label: 'Medium Priority', emoji: '🟡' },
    { value: 'high', label: 'High Priority', emoji: '🔴' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={todo ? "Edit todo..." : "Enter subtask..."}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          disabled={loading}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 text-gray-600 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
          >
            <XMarkIcon className="w-4 h-4" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          <CheckIcon className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};