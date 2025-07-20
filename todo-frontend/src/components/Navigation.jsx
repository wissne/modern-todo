import { useState } from 'react';
import { 
  HomeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  FlagIcon,
  CalendarIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  ClockIcon as ClockIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  FlagIcon as FlagIconSolid,
  CalendarIcon as CalendarIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/react/24/solid';

export const Navigation = ({ activeView, onViewChange, stats }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'active',
      label: 'Active Tasks',
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
      count: stats?.pending || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      count: stats?.total || 0,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircleIcon,
      iconSolid: CheckCircleIconSolid,
      count: stats?.completed || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: ExclamationTriangleIcon,
      iconSolid: ExclamationTriangleIconSolid,
      count: stats?.overdue || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: FlagIcon,
      iconSolid: FlagIconSolid,
      count: stats?.by_priority?.high || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'today',
      label: 'Due Today',
      icon: CalendarIcon,
      iconSolid: CalendarIconSolid,
      count: stats?.dueToday || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'stats',
      label: 'Statistics',
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
      count: null,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleItemClick = (itemId) => {
    onViewChange(itemId);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ item, isActive }) => {
    const Icon = isActive ? item.iconSolid : item.icon;
    
    return (
      <button
        onClick={() => handleItemClick(item.id)}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? `${item.bgColor} ${item.borderColor} border-2 ${item.color} shadow-sm`
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
          <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
            {item.label}
          </span>
        </div>
        {item.count !== null && (
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            isActive 
              ? `${item.color} bg-white` 
              : 'text-gray-500 bg-gray-100 group-hover:bg-gray-200'
          }`}>
            {item.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CheckCircleIconSolid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Todo Manager</h1>
                  <p className="text-sm text-gray-500">Stay organized & productive</p>
                </div>
              </div>
              {/* Mobile close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Close Navigation"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Views
              </h2>
              {navigationItems.slice(0, 4).map((item) => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={activeView === item.id} 
                />
              ))}
            </div>

            <div className="mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h2>
              {navigationItems.slice(4, 6).map((item) => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={activeView === item.id} 
                />
              ))}
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Analytics
              </h2>
              {navigationItems.slice(6).map((item) => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={activeView === item.id} 
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Modern Todo App</p>
              <p className="mt-1">Built with React & Tailwind</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};