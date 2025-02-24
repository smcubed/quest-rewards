import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const TemplateBuilder = ({ isOpen, onClose, onSave }) => {
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('Personal Care');
  const [tasks, setTasks] = useState([]);

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

  const [newTask, setNewTask] = useState({
    name: '',
    category: 'Personal Care',
    frequency: 'Daily',
    xpYoung: 10,
    xpOld: 5,
    requiresPhoto: false,
    requiresParentApproval: false,
    timeLimit: 15,
    notes: ''
  });

  const addTaskToTemplate = () => {
    if (newTask.name.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({
        name: '',
        category: category,
        frequency: 'Daily',
        xpYoung: 10,
        xpOld: 5,
        requiresPhoto: false,
        requiresParentApproval: false,
        timeLimit: 15,
        notes: ''
      });
    }
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSave = () => {
    if (templateName.trim() && tasks.length > 0) {
      onSave({
        name: templateName,
        category,
        tasks: tasks
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Morning Routine Template"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add New Task Form */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Add Tasks to Template</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Task Name</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Frequency</label>
                <select
                  value={newTask.frequency}
                  onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">XP (8yr)</label>
                <input
                  type="number"
                  value={newTask.xpYoung}
                  onChange={(e) => setNewTask({ ...newTask, xpYoung: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">XP (11yr)</label>
                <input
                  type="number"
                  value={newTask.xpOld}
                  onChange={(e) => setNewTask({ ...newTask, xpOld: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={newTask.timeLimit}
                  onChange={(e) => setNewTask({ ...newTask, timeLimit: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Requirements</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.requiresPhoto}
                      onChange={(e) => setNewTask({ ...newTask, requiresPhoto: e.target.checked })}
                      className="mr-2"
                    />
                    Requires Photo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.requiresParentApproval}
                      onChange={(e) => setNewTask({ ...newTask, requiresParentApproval: e.target.checked })}
                      className="mr-2"
                    />
                    Requires Parent Approval
                  </label>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={2}
                />
              </div>
            </div>
            <button
              onClick={addTaskToTemplate}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task to Template
            </button>
          </div>

          {/* Task List */}
          {tasks.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Template Tasks</h3>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-gray-600">
                        {task.frequency} | {task.xpYoung}/{task.xpOld} XP
                      </div>
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!templateName.trim() || tasks.length === 0}
            >
              Save Template
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateBuilder;
