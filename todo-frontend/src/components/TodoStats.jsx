import { CheckCircleIcon, ClockIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';

export const TodoStats = ({ stats }) => {
  if (!stats) return null;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ChartBarIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrophyIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-800">Your Progress</h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className={`${item.bgColor} ${item.borderColor} border-2 rounded-xl p-3 transition-all duration-200 hover:shadow-md transform hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className={`text-2xl font-bold ${item.color} mb-1`}>
                {item.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-indigo-600">{completionRate}%</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${completionRate}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
        {completionRate === 100 && stats.total > 0 && (
          <div className="text-center py-2">
            <span className="text-green-600 font-semibold text-sm">🎉 All tasks completed! Great job!</span>
          </div>
        )}
      </div>
    </div>
  );
};