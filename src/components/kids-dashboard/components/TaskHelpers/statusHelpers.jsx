// src/components/kids-dashboard/components/DailyTasks/StatusIndicator.jsx

import React from 'react';
import { getTaskIcon } from '../TaskHelpers/taskComponents';
import { getStatusClasses } from '../TaskHelpers/statusHelpers';

const StatusIndicator = ({ status }) => {
  const statusClass = getStatusClasses(status);
  
  return (
    <div className={`p-2 rounded-full ${statusClass}`}>
      {getTaskIcon(status)}
    </div>
  );
};

export default StatusIndicator;