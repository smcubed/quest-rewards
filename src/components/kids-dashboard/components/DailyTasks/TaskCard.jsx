// src/components/kids-dashboard/components/DailyTasks/TaskCard.jsx
import React from 'react';
import { Zap, Coins } from 'lucide-react';
import { TaskStatusMessage } from '../TaskHelpers/taskComponents';
import { getTaskStyles } from '../TaskHelpers/statusHelpers';
import StatusIndicator from './StatusIndicator';

const TaskCard = ({ 
  task, 
  status, 
  isDisabled, 
  onClick, 
  onSubmit 
}) => {
  return (
    <div
      onClick={onClick}
      className={`${getTaskStyles(status)}
        ${status !== 'approved' && !isDisabled ? 'hover:shadow-sm cursor-pointer' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIndicator status={status} />
          <div>
            <div className="font-medium">{task.name}</div>
            <div className="text-sm text-gray-600">{task.notes}</div>
            
            <TaskStatusMessage 
              status={status} 
              isDisabled={isDisabled} 
              task={task} 
            />

            {status === 'denied' && task.feedback && (
              <div className="mt-2 p-2 bg-red-100 rounded text-red-700 text-sm">
                <div className="font-medium">Needs improvement:</div>
                <div>{task.feedback}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(e);
                  }}
                  className="mt-2 px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Show both XP and Gold rewards */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{task.xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="font-medium">{task.goldYoung || task.xp} Gold</span>
          </div>
          
          {status === 'in-progress' && !isDisabled && (
            <button
              onClick={onSubmit}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition-colors"
            >
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;