// src/components/parent-dashboard/CashOutModal.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, CheckCircle } from 'lucide-react';

const CashOutModal = ({ isOpen, onClose, children, onCashOut }) => {
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedTier, setSelectedTier] = useState('standard');
  
  const tiers = {
    standard: { amount: 10, xpCost: 1500 },
    elite: { amount: 25, xpCost: 7500 },
    epic: { amount: 50, xpCost: 20000 },
    legendary: { amount: 100, xpCost: 40000 }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCashOut({
      childId: selectedChild,
      tier: selectedTier,
      amount: tiers[selectedTier].amount,
      xpCost: tiers[selectedTier].xpCost
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            Cash Out Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Child Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Select Child</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Choose a child</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} - {child.currentXP} XP Available
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cash Out Tier</label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                {Object.entries(tiers).map(([tier, { amount, xpCost }]) => (
                  <option key={tier} value={tier}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)} - ${amount} (${xpCost} XP)
                  </option>
                ))}
              </select>
            </div>

            {/* Preview */}
            {selectedChild && selectedTier && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
                <h3 className="font-medium text-green-800 mb-2">Cash Out Preview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>XP Cost:</span>
                    <span>{tiers[selectedTier].xpCost} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Value:</span>
                    <span>${tiers[selectedTier].amount}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Rate:</span>
                    <span>
                      ${(tiers[selectedTier].amount / tiers[selectedTier].xpCost * 1000).toFixed(2)} per 1000 XP
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                disabled={!selectedChild || !selectedTier}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Cash Out
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashOutModal;