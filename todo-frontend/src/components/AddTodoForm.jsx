import { useState } from 'react';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export const AddTodoForm = ({ onAdd, loading = false }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      // Convert date to datetime format if provided
      let formattedDueDate = null;
      if (dueDate) {
        // Add time component to make it a valid datetime (end of day)
        formattedDueDate = `${dueDate}T23:59:59`;
      }
      
      await onAdd({
        text: text.trim(),
        priority,
        due_date: formattedDueDate
      });
      setText('');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]); // Reset to today
      setIsExpanded(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', emoji: '🟢' },
    { value: 'medium', label: 'Medium Priority', emoji: '🟡' },
    { value: 'high', label: 'High Priority', emoji: '🔴' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4 transition-all duration-200 hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What needs to be done? ✨"
              className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium"
            disabled={loading}
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                Hide Options
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                More Options
              </>
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority Level
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
        )}
      </form>
    </div>
  );
};