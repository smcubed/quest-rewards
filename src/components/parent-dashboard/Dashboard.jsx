// src/components/parent-dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  AlertCircle,
  Gift,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  AlertTriangle
} from 'lucide-react';
import TaskModal from '../shared/TaskModal';
import RewardModal from '../shared/RewardModal';
import DeductionModal from '../shared/DeductionModal';
import ReviewModal from './ReviewModal';
import { useXP } from '../../contexts/XPContext';
import { useTasks } from '../../contexts/TaskContext';
import { useRewards } from '../../contexts/RewardContext';
import { useAuth } from '../../contexts/AuthContext';

const ParentDashboard = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  
  const { applyXPDeduction } = useXP();
  const { tasks, getPendingVerifications, verifyTask, denyTask } = useTasks();
  const { rewards, getPendingClaims, approveReward, denyReward } = useRewards();
  const { currentUser } = useAuth();

  // Load and update children data
  const loadChildrenData = () => {
    // Get children data from auth storage
    const authData = JSON.parse(localStorage.getItem('quest-rewards-auth') || '{}');
    const children = authData.children || [];

    // Get tasks data
    const pendingVerifications = getPendingVerifications();
    const pendingClaims = getPendingClaims();

    // Process data for each child
    const processedChildren = children.map(child => {
      const childTasks = tasks.filter(task =>
        task.completed &&
        task.completedBy === child.id
      );

      const pendingChildVerifications = pendingVerifications.filter(task =>
        task.completedBy === child.id
      );

      // Find the next reward the child is working towards
      const availableRewards = rewards
        .filter(reward =>
          reward.available &&
          reward.xpCost > child.currentXP
        )
        .sort((a, b) => a.xpCost - b.xpCost);

      const nextReward = availableRewards[0];
      const rewardProgress = nextReward
        ? Math.round((child.currentXP / nextReward.xpCost) * 100)
        : 100;

      return {
        ...child,
        tasksCompleted: childTasks.length,
        pendingVerification: pendingChildVerifications.length,
        nextReward: nextReward?.name || 'All rewards claimed!',
        rewardProgress: rewardProgress
      };
    });

    setChildrenData(processedChildren);

    // Update pending actions
    const allPendingActions = [];

    // Add verification actions
    pendingVerifications.forEach(task => {
      const child = children.find(c => c.id === task.completedBy);
      if (child) {
        allPendingActions.push({
          type: 'verification',
          child: child.name,
          childId: child.id,
          task: task.name,
          taskId: task.id,
          time: new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          photo: task.photo
        });
      }
    });

    // Add reward claim actions
    pendingClaims.forEach(claim => {
      const child = children.find(c => c.id === claim.childId);
      const reward = rewards.find(r => r.id === claim.rewardId);
      if (child && reward) {
        allPendingActions.push({
          type: 'reward',
          child: child.name,
          childId: child.id,
          reward: reward.name,
          rewardId: reward.id,
          time: new Date(claim.claimedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    setPendingActions(allPendingActions);
  };

  // Load initial data
  useEffect(() => {
    loadChildrenData();
  }, [tasks, rewards, getPendingVerifications, getPendingClaims]);

  const handleDeduction = async (deductionData) => {
    try {
      await applyXPDeduction(deductionData);
      // Refresh children data after deduction
      const authData = JSON.parse(localStorage.getItem('quest-rewards-auth') || '{}');
      const updatedChildren = authData.children || [];
      setChildrenData(prevChildren =>
        prevChildren.map(child => {
          const updatedChild = updatedChildren.find(c => c.id === child.id);
          return updatedChild ? { ...child, ...updatedChild } : child;
        })
      );
    } catch (error) {
      console.error('Error applying deduction:', error);
    }
  };

  const handleReviewAction = (action) => {
    setSelectedAction(action);
    setIsReviewModalOpen(true);
  };

  const handleApprove = async (action) => {
    try {
      if (action.type === 'verification') {
        await verifyTask(action.taskId);
      } else {
        await approveReward(action.rewardId);
      }
      // Refresh data after approval
      loadChildrenData();
    } catch (error) {
      console.error('Error approving action:', error);
    }
  };

  const handleDeny = async (action, feedback) => {
    try {
      if (action.type === 'verification') {
        await denyTask(action.taskId, feedback);
      } else {
        await denyReward(action.rewardId);
      }
      // Refresh data after denial
      loadChildrenData();
    } catch (error) {
      console.error('Error denying action:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
          <button
            onClick={() => setIsRewardModalOpen(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2 transition-colors"
          >
            <Gift className="w-4 h-4" />
            Add New Reward
          </button>
          <button
            onClick={() => setIsDeductionModalOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Deduct XP
          </button>
        </div>
      </div>

      {/* Children Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {childrenData.map(child => (
          <Card key={child.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex justify-between items-center">
                <span>{child.name}'s Progress</span>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Level {child.level}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* XP Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>XP Progress</span>
                  <span>{child.currentXP} XP</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${(child.currentXP / 5000) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Tasks Complete</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {child.tasksCompleted}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-600 mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {child.pendingVerification}
                  </span>
                </div>
              </div>

              {/* Next Reward Progress */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Next Reward</span>
                  </div>
                  <span className="text-sm text-purple-600">{child.rewardProgress}%</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{child.nextReward}</div>
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${child.rewardProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {action.type === 'verification' && (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  {action.type === 'reward' && (
                    <Gift className="w-5 h-5 text-purple-500" />
                  )}
                  <div>
                    <div className="font-medium">{action.child}</div>
                    <div className="text-sm text-gray-600">
                      {action.type === 'verification' && `Verify: ${action.task}`}
                      {action.type === 'reward' && `Claim: ${action.reward}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{action.time}</span>
                  <button
                    onClick={() => handleReviewAction(action)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
            {pendingActions.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No pending actions at this time.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <RewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
      />
      <DeductionModal
        isOpen={isDeductionModalOpen}
        onClose={() => setIsDeductionModalOpen(false)}
        onDeduct={handleDeduction}
        children={childrenData}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        action={selectedAction}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </div>
  );
};

export default ParentDashboard;