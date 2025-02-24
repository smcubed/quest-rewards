import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRewards } from '../../contexts/RewardContext';

const RewardModal = ({ isOpen, onClose, mode = 'create', rewardData = null }) => {
  const { addReward, updateReward } = useRewards();
  const [formData, setFormData] = useState(rewardData || {
    name: '',
    description: '',
    tier: 'weekly',
    xpCost: 500,
    minLevel: 1,
    availability: 'always',
    timeLimit: null,
    unlimited: false,
    requiresApproval: true
  });

  const tiers = [
    { value: 'weekly', label: 'Weekly (500-1,500 XP)' },
    { value: 'monthly', label: 'Monthly (4,000-7,500 XP)' },
    { value: 'quarterly', label: 'Quarterly (12,000-20,000 XP)' },
    { value: 'special', label: 'Special Event' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      addReward(formData);
    } else {
      updateReward(rewardData.id, formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Reward' : 'Edit Reward'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Reward Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            {/* Reward Tier and Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Reward Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {tiers.map(tier => (
                    <option key={tier.value} value={tier.value}>{tier.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">XP Cost</label>
                <input
                  type="number"
                  value={formData.xpCost}
                  onChange={(e) => setFormData({ ...formData, xpCost: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Minimum Level</label>
                <input
                  type="number"
                  value={formData.minLevel}
                  onChange={(e) => setFormData({ ...formData, minLevel: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="always">Always Available</option>
                  <option value="limited">Limited Time</option>
                  <option value="special">Special Event Only</option>
                </select>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Settings</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.unlimited}
                    onChange={(e) => setFormData({ ...formData, unlimited: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Unlimited Claims</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.requiresApproval}
                    onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Requires Parent Approval</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                {mode === 'create' ? 'Create Reward' : 'Update Reward'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardModal;
