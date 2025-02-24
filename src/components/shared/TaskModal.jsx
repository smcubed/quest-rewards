import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTasks } from '../../contexts/TaskContext';

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { addTask, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Personal Care',
    frequency: 'Daily',
    xpYoung: 10,
    xpOld: 5,
    goldYoung: 10,
    goldOld: 5,
    requiresPhoto: false,
    requiresParentApproval: false,
    timeLimit: 15,
    notes: ''
  });

  // Load task data when editing
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        ...taskToEdit,
        goldYoung: taskToEdit.goldYoung || taskToEdit.xpYoung,
        goldOld: taskToEdit.goldOld || taskToEdit.xpOld
      });
    } else {
      // Reset form when not editing
      setFormData({
        name: '',
        description: '',
        category: 'Personal Care',
        frequency: 'Daily',
        xpYoung: 10,
        xpOld: 5,
        goldYoung: 10,
        goldOld: 5,
        requiresPhoto: false,
        requiresParentApproval: false,
        timeLimit: 15,
        notes: ''
      });
    }
  }, [taskToEdit]);

  const categories = [
    'Personal Care',
    'Organization',
    'House Responsibilities',
    'Pet Care',
    'Academics'
  ];

  const frequencies = [
    'Daily',
    'Weekly',
    'Bi-Weekly',
    'Monthly'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, formData);
      } else {
        await addTask(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{taskToEdit ? 'Edit Task' : 'Create New Task'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Task Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">XP (8yr)</label>
                <input
                  type="number"
                  value={formData.xpYoung}
                  onChange={(e) => setFormData({ ...formData, xpYoung: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">XP (11yr)</label>
                <input
                  type="number"
                  value={formData.xpOld}
                  onChange={(e) => setFormData({ ...formData, xpOld: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Time Limit (min)</label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
            </div>

            {/* Gold Coin fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Gold (8yr)</label>
                <input
                  type="number"
                  value={formData.goldYoung}
                  onChange={(e) => setFormData({ ...formData, goldYoung: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Gold (11yr)</label>
                <input
                  type="number"
                  value={formData.goldOld}
                  onChange={(e) => setFormData({ ...formData, goldOld: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Requirements</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiresPhoto}
                    onChange={(e) => setFormData({ ...formData, requiresPhoto: e.target.checked })}
                    className="mr-2"
                  />
                  Requires Photo
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiresParentApproval}
                    onChange={(e) => setFormData({ ...formData, requiresParentApproval: e.target.checked })}
                    className="mr-2"
                  />
                  Requires Parent Approval
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {taskToEdit ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskModal;