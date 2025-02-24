// src/components/kids-dashboard/components/TaskHelpers/taskComponents.jsx
import React from 'react';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { getStatusClasses } from './statusHelpers';

export const getTaskIcon = (status) => {
  const iconProps = "w-5 h-5";
  switch (status) {
    case 'approved':
      return <CheckCircle className={`${iconProps} text-green-600`} />;
    case 'pending-review':
      return <Clock className={`${iconProps} text-orange-600`} />;
    case 'denied':
      return <RefreshCw className={`${iconProps} text-red-600`} />;
    case 'in-progress':
      return <Clock className={`${iconProps} text-yellow-600`} />;
    default:
      return <CheckCircle className={`${iconProps} text-gray-400`} />;
  }
};

// Make sure this is properly exported
export const TaskStatusMessage = ({ status, isDisabled, task }) => {
  if (isDisabled && !task.completed) {
    return <div className="text-gray-500 text-sm mt-1">Daily XP limit reached</div>;
  }
  
  switch (status) {
    case 'in-progress':
      return <div className="text-yellow-600 text-sm mt-1">Working on it...</div>;
    case 'pending-review':
      return <div className="text-orange-600 text-sm mt-1">Waiting for parent review</div>;
    default:
      return null;
  }
};