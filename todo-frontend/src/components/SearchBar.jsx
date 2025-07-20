import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const SearchBar = ({ onSearch, loading = false, sortType = 'default', onSortChange, orderType = 'asc', onOrderChange }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const isSearchingRef = useRef(false);

  // Debounced search with focus preservation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      isSearchingRef.current = true;
      onSearch(query);
      // Restore focus after search completes
      setTimeout(() => {
        if (isSearchingRef.current && inputRef.current) {
          inputRef.current.focus();
          isSearchingRef.current = false;
        }
      }, 50);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]); // Only depend on query, not onSearch

  const handleClear = () => {
    setQuery('');
    // Keep focus on input after clearing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search todos..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          disabled={loading}
          onBlur={() => {
            if (isSearchingRef.current) {
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 10);
            }
          }}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        )}
    </div>
    {/* 排序下拉菜单 */}
    <select
      className="py-3 px-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
      value={sortType}
      onChange={e => onSortChange && onSortChange(e.target.value)}
      style={{ minWidth: 120 }}
    >
      <option value="default">Default</option>
      <option value="created">Created At</option>
      <option value="updated">Updated At</option>
      <option value="priority">Priority</option>
      <option value="due">Due Date</option>
      <option value="completed">Completed Status</option>
    </select>
    {/* Asc/Desc切换按钮 */}
    <button
      type="button"
      className={`py-3 px-3 border-2 rounded-xl ml-2 transition-all duration-200 focus:outline-none ${orderType === 'asc' ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-indigo-50 border-indigo-300 text-indigo-700'}`}
      onClick={() => onOrderChange && onOrderChange(orderType === 'asc' ? 'desc' : 'asc')}
      title={orderType === 'asc' ? 'Asc' : 'Desc'}
    >
      {orderType === 'asc' ? 'Asc' : 'Desc'}
    </button>
  </div>
  );
};