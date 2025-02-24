// src/components/kids-dashboard/components/TaskHelpers/statusHelpers.js

// Status checking function
export const getTaskStatus = (task) => {
  if (task.denied) return 'denied';
  if (task.verified) return 'approved';
  if (task.completed) return 'pending-review';
  if (task.selected) return 'in-progress';
  return 'available';
};

// Style helper functions
export const getTaskStyles = (status) => {
  const baseStyles = 'p-3 rounded-lg transition-all duration-200 border';
  const statusStyles = {
    'available': 'bg-white hover:bg-gray-50',
    'in-progress': 'bg-yellow-50 hover:bg-yellow-100',
    'pending-review': 'bg-orange-50 hover:bg-orange-100',
    'approved': 'bg-green-50',
    'denied': 'bg-red-50'
  };
  return `${baseStyles} ${statusStyles[status] || statusStyles.available}`;
};

// Aliasing getStatusIndicatorStyles as getStatusClasses for backwards compatibility
export const getStatusIndicatorStyles = (status) => {
  const statusClasses = {
    'approved': 'bg-green-100 text-green-600',
    'pending-review': 'bg-orange-100 text-orange-600',
    'in-progress': 'bg-yellow-100 text-yellow-600',
    'denied': 'bg-red-100 text-red-600',
    'available': 'bg-gray-100 text-gray-400'
  };
  
  return statusClasses[status] || statusClasses.available;
};

export const getStatusClasses = getStatusIndicatorStyles;