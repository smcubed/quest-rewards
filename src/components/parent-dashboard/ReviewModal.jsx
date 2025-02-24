// src/components/parent-dashboard/ReviewModal.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Gift, MessageSquare } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, action, onApprove, onDeny }) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  if (!isOpen) return null;

  const handleDeny = () => {
    // For tasks, require feedback
    if (action.type === 'verification' && !showFeedback) {
      setShowFeedback(true);
      return;
    }

    // For tasks, ensure feedback is provided
    if (action.type === 'verification' && !feedback.trim()) {
      return;
    }

    onDeny(action, feedback);
    onClose();
    setFeedback('');
    setShowFeedback(false);
  };

  const handleApprove = () => {
    onApprove(action);
    onClose();
    setFeedback('');
    setShowFeedback(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {action.type === 'verification' ? (
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            ) : (
              <Gift className="w-6 h-6 text-purple-500" />
            )}
            Review {action.type === 'verification' ? 'Task' : 'Reward'} Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium">Child</div>
              <div className="text-gray-600">{action.child}</div>
            </div>

            <div className="space-y-2">
              <div className="font-medium">
                {action.type === 'verification' ? 'Task' : 'Reward'}
              </div>
              <div className="text-gray-600">
                {action.type === 'verification' ? action.task : action.reward}
              </div>
            </div>

            {action.photo && (
              <div className="space-y-2">
                <div className="font-medium">Proof Photo</div>
                <img
                  src={action.photo}
                  alt="Task completion proof"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="font-medium">Time Submitted</div>
              <div className="text-gray-600">{action.time}</div>
            </div>

            {/* Feedback Section for Task Denial */}
            {action.type === 'verification' && showFeedback && (
              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  Feedback for improvement:
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Please explain what needs to be improved..."
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeny}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {showFeedback ? 'Send Feedback' : 'Deny'}
              </button>
              {!showFeedback && (
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewModal;