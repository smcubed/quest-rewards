import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const DeductionModal = ({ isOpen, onClose, children, onDeduct }) => {
  const [formData, setFormData] = useState({
    childId: '',
    amount: '',
    severity: 'minor',
    reason: '',
    redemptionQuest: false,
    redemptionDetails: ''
  });

  const severityOptions = [
    { value: 'minor', label: 'Minor (-10 to -20 XP)', range: { min: 10, max: 20 } },
    { value: 'medium', label: 'Medium (-30 to -50 XP)', range: { min: 30, max: 50 } },
    { value: 'major', label: 'Major (-75 to -100 XP)', range: { min: 75, max: 100 } }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onDeduct(formData);
    onClose();
  };

  // Update amount when severity changes
  const handleSeverityChange = (e) => {
    const severity = e.target.value;
    const range = severityOptions.find(opt => opt.value === severity).range;
    setFormData({
      ...formData,
      severity,
      amount: range.min
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            Apply XP Deduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Child Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Select Child</label>
              <select
                value={formData.childId}
                onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a child</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>

            {/* Severity and Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Severity Level</label>
                <select
                  value={formData.severity}
                  onChange={handleSeverityChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  {severityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">XP Deduction Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min={severityOptions.find(opt => opt.value === formData.severity)?.range.min}
                  max={severityOptions.find(opt => opt.value === formData.severity)?.range.max}
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Reason for Deduction</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>

            {/* Redemption Quest Option */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.redemptionQuest}
                  onChange={(e) => setFormData({ ...formData, redemptionQuest: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Offer Redemption Quest</span>
              </label>

              {formData.redemptionQuest && (
                <textarea
                  value={formData.redemptionDetails}
                  onChange={(e) => setFormData({ ...formData, redemptionDetails: e.target.value })}
                  placeholder="Describe what the child can do to earn back points..."
                  className="w-full p-2 border rounded mt-2"
                  rows={2}
                />
              )}
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              Note: XP deductions cannot cause a negative balance. The child's level may decrease if they fall below the required XP threshold.
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
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Apply Deduction
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeductionModal;
