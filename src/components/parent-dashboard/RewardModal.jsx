// src/components/parent-dashboard/RewardModal.jsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, Clock, Gift, Timer } from 'lucide-react';

const RewardModal = ({ isOpen, onClose, onSave, editingReward = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tier: 'standard',
    xpCost: 500,
    minLevel: 1,
    requiresApproval: true,
    isSpecial: false,
    timeLimit: 7,
    availability: 'always'
  });

  useEffect(() => {
    if (editingReward) {
      setFormData({
        ...editingReward,
        isSpecial: editingReward.tier === 'special',
        timeLimit: editingReward.timeLimit || 7
      });
    }
  }, [editingReward]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const rewardData = {
      ...formData,
      tier: formData.isSpecial ? 'special' : formData.tier,
      expiresAt: formData.isSpecial ? 
        new Date(Date.now() + formData.timeLimit * 24 * 60 * 60 * 1000).toISOString() : 
        null
    };
    onSave(rewardData);
    onClose();
  };

  const standardTiers = [
    { value: 'standard', label: 'Standard (500-1,500 XP)' },
    { value: 'elite', label: 'Elite (4,000-7,500 XP)' },
    { value: 'epic', label: 'Epic (12,000-20,000 XP)' },
    { value: 'legendary', label: 'Legendary (25,000+ XP)' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-500" />
            {editingReward ? 'Edit Reward' : 'Create New Reward'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Special Reward Toggle */}
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <input
                type="checkbox"
                id="isSpecial"
                checked={formData.isSpecial}
                onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isSpecial" className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Make this a Special Time-Limited Reward</span>
              </label>
            </div>

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

            {/* Tier and XP Cost */}
            <div className="grid grid-cols-2 gap-4">
              {!formData.isSpecial && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Reward Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    {standardTiers.map(tier => (
                      <option key={tier.value} value={tier.value}>{tier.label}</option>
                    ))}
                  </select>
                </div>
              )}
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

            {/* Level Requirement */}
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

            {/* Special Reward Options */}
            {formData.isSpecial && (
              <div className="space-y-4 bg-yellow-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Time Limit (Days)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded"
                      min="1"
                      required
                    />
                    <Timer className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <div className="text-sm text-yellow-800">
                  This reward will expire automatically after the specified number of days.
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Settings</label>
              <div className="space-y-2">
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
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                {editingReward ? 'Update Reward' : 'Create Reward'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardModal;