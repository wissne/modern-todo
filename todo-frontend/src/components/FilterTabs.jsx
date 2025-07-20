export const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All', count: null },
    { key: 'active', label: 'Active', count: null },
    { key: 'completed', label: 'Completed', count: null },
  ]

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeFilter === filter.key
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}