import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CheckCircle,
  Clock,
  Star,
  AlertCircle,
  Lock,
  User,
  Calendar,
  RefreshCcw
} from 'lucide-react';

const TaskCard = ({
  task,
  onComplete,
  onVerify,
  onEdit,
  showControls = true
}) => {
  const { currentUser, isParent } = useAuth();

  const {
    id,
    name,
    description,
    category,
    xpValue,
    completed,
    completedBy,
    completedAt,
    isShared,
    requiresVerification,
    verified,
    streak = 0,
    dueTime
  } = task;

  const getStatusColor = () => {
    if (completed && verified) return 'bg-green-100 text-green-700';
    if (completed && requiresVerification && !verified) return 'bg-yellow-100 text-yellow-700';
    if (isShared && completedBy && completedBy !== currentUser?.id) return 'bg-gray-100 text-gray-500';
    return 'bg-blue-100 text-blue-700';
  };

  const getStatusIcon = () => {
    if (completed && verified) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (completed && requiresVerification && !verified) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    if (isShared && completedBy && completedBy !== currentUser?.id) return <Lock className="w-5 h-5 text-gray-500" />;
    return <Star className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      {/* Task Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-gray-700">{xpValue} XP</span>
        </div>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        {/* Left Column */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{category}</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center text-sm text-purple-600">
              <RefreshCcw className="w-4 h-4 mr-2" />
              <span>{streak} day streak!</span>
            </div>
          )}
        </div>
        {/* Right Column */}
        <div className="space-y-2">
          {dueTime && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Due: {dueTime}</span>
            </div>
          )}
          {isShared && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>{completedBy ? `Done by ${completedBy}` : 'Available'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showControls && (
        <div className="flex justify-end space-x-2 mt-4">
          {isParent() ? (
            // Parent Controls
            <>
              {requiresVerification && completed && !verified && (
                <button
                  onClick={() => onVerify(id)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Verify Task
                </button>
              )}
              <button
                onClick={() => onEdit(id)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Edit
              </button>
            </>
          ) : (
            // Child Controls
            !completed && !completedBy && (
              <button
                onClick={() => onComplete(id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Complete Quest
              </button>
            )
          )}
        </div>
      )}

      {/* Completion Status */}
      {completed && completedAt && (
        <div className="mt-3 text-xs text-gray-500">
          Completed: {new Date(completedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
