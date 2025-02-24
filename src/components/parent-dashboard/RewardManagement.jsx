import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Gift,
  Star,
  Award,
  Medal,
  Shield,
  Clock,
  DollarSign,
  Edit,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import { useRewards } from '../../contexts/RewardContext';
import { useNotifications } from '../shared/NotificationSystem';
import CashOutModal from './CashOutModal';
import RewardModal from './RewardModal';
import ReviewModal from './ReviewModal';
import TaskModal from '../shared/TaskModal';

const RewardManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);
  const [isSpecialRewardModalOpen, setIsSpecialRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [children, setChildren] = useState([]);
  
  const { rewards, deleteReward, addReward, updateReward } = useRewards();
  const { addNotification } = useNotifications();
  
  // Load children data on component mount
  useEffect(() => {
    const loadChildren = () => {
      const authData = JSON.parse(localStorage.getItem('quest-rewards-auth') || '{}');
      const childrenData = authData.children || [];
      setChildren(childrenData);
    };
    loadChildren();
  }, []);

  const handleDeleteReward = (rewardId) => {
    deleteReward(rewardId);
    addNotification({
      title: 'Reward Deleted',
      description: 'The reward has been successfully deleted.',
      type: 'success'
    });
  };

  const handleDuplicateReward = (reward) => {
    const newReward = {
      ...reward,
      id: undefined,
      name: `${reward.name} (Copy)`,
    };
    addReward(newReward);
    addNotification({
      title: 'Reward Duplicated',
      description: 'A copy of the reward has been created.',
      type: 'success'
    });
  };

  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setIsRewardModalOpen(true);
  };

  const rewardTiers = {
    standard: {
      name: 'Standard (Weekly)',
      xpRange: '500-1,500',
      cashOut: { amount: 10, xpCost: 1500 },
      icon: <Gift className="w-5 h-5 text-blue-500" />
    },
    elite: {
      name: 'Elite (Monthly)',
      xpRange: '4,000-7,500',
      cashOut: { amount: 25, xpCost: 7500 },
      icon: <Star className="w-5 h-5 text-purple-500" />
    },
    epic: {
      name: 'Epic (Quarterly)',
      xpRange: '12,000-20,000',
      cashOut: { amount: 50, xpCost: 20000 },
      icon: <Award className="w-5 h-5 text-yellow-500" />
    },
    legendary: {
      name: 'Legendary',
      xpRange: '25,000-40,000',
      cashOut: { amount: 100, xpCost: 40000 },
      icon: <Medal className="w-5 h-5 text-orange-500" />
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reward Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCashoutModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Review Cash Out
          </button>
          <button
            onClick={() => {
              setEditingReward(null);
              setIsRewardModalOpen(true);
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Reward
          </button>
        </div>
      </div>

      {/* Special Rewards Section */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Special Time-Limited Rewards</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {rewards
              .filter(reward => reward.tier === 'special')
              .map(reward => (
                <div
                  key={reward.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-yellow-500" />
                    <div>
                      <div className="font-medium">{reward.name}</div>
                      <div className="text-sm text-gray-600">
                        {reward.xpCost} XP - Level {reward.minLevel}+
                      </div>
                      {reward.expiresAt && (
                        <div className="text-xs text-orange-600">
                          Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicateReward(reward)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleEditReward(reward)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            {rewards.filter(reward => reward.tier === 'special').length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No special rewards available. Create a Special Reward with the Create Reward button.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tier Sections */}
      {Object.entries(rewardTiers).map(([key, tier]) => (
        <Card key={key} className="overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${
            key === 'standard' ? 'from-blue-50 to-blue-100' :
            key === 'elite' ? 'from-purple-50 to-purple-100' :
            key === 'epic' ? 'from-yellow-50 to-yellow-100' :
            'from-orange-50 to-orange-100'
          }`}>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {tier.icon}
                <span>{tier.name}</span>
              </div>
              <span className="text-sm text-gray-600">{tier.xpRange} XP</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rewards List */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Rewards</h3>
                {rewards
                  .filter(reward => reward.tier === key)
                  .map(reward => (
                    <div
                      key={reward.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-gray-600">
                            {reward.xpCost} XP
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDuplicateReward(reward)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteReward(reward.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Cash Out Option */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Cash Out Option</h3>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Cash Value</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      ${tier.cashOut.amount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Exchange {tier.cashOut.xpCost} XP for ${tier.cashOut.amount} cash
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Rate: ${(tier.cashOut.amount / tier.cashOut.xpCost * 1000).toFixed(2)} per 1000 XP
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modals */}
      <RewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        editingReward={editingReward}
        onSave={(rewardData) => {
          if (editingReward) {
            updateReward(editingReward.id, rewardData);
            addNotification({
              title: 'Reward Updated',
              description: 'The reward has been successfully updated.',
              type: 'success'
            });
          } else {
            addReward(rewardData);
            addNotification({
              title: 'Reward Created',
              description: `Successfully created ${rewardData.isSpecial ? 'special ' : ''}reward.`,
              type: 'success'
            });
          }
        }}
      />

      <CashOutModal
        isOpen={isCashoutModalOpen}
        onClose={() => setIsCashoutModalOpen(false)}
        children={children}
        onCashOut={(cashOutData) => {
          console.log('Processing cash out:', cashOutData);
          addNotification({
            title: 'Cash Out Processed',
            description: `Successfully processed cash out for ${
              children.find(c => c.id === cashOutData.childId)?.name
            }`,
            type: 'success'
          });
        }}
      />
    </div>
  );
};

export default RewardManagement;