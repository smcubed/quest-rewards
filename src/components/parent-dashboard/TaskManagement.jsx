import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Plus,
  Filter,
  Clock,
  Copy,
  Edit,
  Trash2,
  Calendar,
  ArrowUpDown,
  FilePlus,
  Timer
} from 'lucide-react';
import TaskModal from '../shared/TaskModal';
import TemplateBuilder from '../shared/TemplateBuilder';
import { useTasks } from '../../contexts/TaskContext';

// Predefined task templates
const taskTemplates = {
  'Personal Care': [
    { name: "Morning Routine", category: "Personal Care", frequency: "Daily", xpYoung: 10, xpOld: 5, requiresPhoto: false, requiresParentApproval: false, timeLimit: 15, notes: "Brush teeth, wash face, get dressed" },
    { name: "Evening Routine", category: "Personal Care", frequency: "Daily", xpYoung: 10, xpOld: 5, requiresPhoto: false, requiresParentApproval: false, timeLimit: 15, notes: "Brush teeth, wash face, pajamas" },
  ],
  'Organization': [
    { name: "Clean Room", category: "Organization", frequency: "Daily", xpYoung: 15, xpOld: 10, requiresPhoto: true, requiresParentApproval: true, timeLimit: 20, notes: "Make bed, pick up toys, organize desk" },
    { name: "Organize Backpack", category: "Organization", frequency: "Weekly", xpYoung: 10, xpOld: 5, requiresPhoto: false, requiresParentApproval: true, timeLimit: 10, notes: "Clean out and organize school backpack" },
  ],
  'Pet Care': [
    { name: "Feed Bailey", category: "Pet Care", frequency: "Daily", xpYoung: 10, xpOld: 10, requiresPhoto: false, requiresParentApproval: false, timeLimit: 5, notes: "Morning and evening feeding" },
    { name: "Walk Bailey", category: "Pet Care", frequency: "Daily", xpYoung: 15, xpOld: 15, requiresPhoto: false, requiresParentApproval: false, timeLimit: 20, notes: "20-minute walk" },
  ]
};

const TaskManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
  const [isTemplateSelectOpen, setIsTemplateSelectOpen] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [taskToEdit, setTaskToEdit] = useState(null);
  const { tasks, addTask, deleteTask, updateTask } = useTasks();

  // Load saved templates on component mount
  useEffect(() => {
    const templates = JSON.parse(localStorage.getItem('quest-rewards-templates') || '[]');
    setSavedTemplates(templates);
  }, []);

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

  const handleTemplateSelect = async (category) => {
    try {
      const templateTasks = taskTemplates[category];
      for (const task of templateTasks) {
        await addTask(task);
      }
      setIsTemplateSelectOpen(false);
    } catch (error) {
      console.error('Error adding template tasks:', error);
    }
  };

  const handleSaveTemplate = (template) => {
    const updatedTemplates = [...savedTemplates, template];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quest-rewards-templates', JSON.stringify(updatedTemplates));
  };

  const handleUseTemplate = async (template) => {
    try {
      for (const task of template.tasks) {
        await addTask(task);
      }
    } catch (error) {
      console.error('Error adding template tasks:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDuplicateTask = async (task) => {
    try {
      const duplicatedTask = {
        ...task,
        id: undefined, // Let the addTask function generate a new ID
        name: `${task.name} (Copy)`,
        completed: false,
        completedBy: null,
        completedAt: null,
        verified: false
      };
      await addTask(duplicatedTask);
    } catch (error) {
      console.error('Error duplicating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Update the TaskModal close handler
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null); // Clear the task being edited
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const getSortedTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      let compareA, compareB;
      
      switch (sortBy) {
        case 'name':
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case 'xpYoung':
          compareA = a.xpYoung;
          compareB = b.xpYoung;
          break;
        case 'xpOld':
          compareA = a.xpOld;
          compareB = b.xpOld;
          break;
        case 'frequency':
          const freqOrder = { 'Daily': 0, 'Weekly': 1, 'Bi-Weekly': 2, 'Monthly': 3 };
          compareA = freqOrder[a.frequency];
          compareB = freqOrder[b.frequency];
          break;
        case 'timeLimit':
          compareA = a.timeLimit || 0;
          compareB = b.timeLimit || 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareB < compareA ? -1 : compareB > compareA ? 1 : 0;
      }
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedFrequency !== 'all' && task.frequency !== selectedFrequency) return false;
    return true;
  });

  return (
    <div className="w-full max-w-6xl p-4 space-y-4">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setTaskToEdit(null); // Ensure no task is being edited when adding new
              setIsTaskModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
          <button
            onClick={() => setIsTemplateSelectOpen(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 hover:bg-purple-600"
          >
            <Copy className="w-4 h-4" />
            Use Template
          </button>
          <button
            onClick={() => setIsTemplateBuilderOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
          >
            <FilePlus className="w-4 h-4" />
            Create New Template
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                className="p-2 border rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <select
                className="p-2 border rounded-lg"
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
              >
                <option value="all">All Frequencies</option>
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Templates */}
      {savedTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {savedTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleUseTemplate(template)}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                >
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600">
                    {template.tasks.length} tasks | {template.category}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Tasks</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="name">Name</option>
                  <option value="xpYoung">8yr XP</option>
                  <option value="xpOld">11yr XP</option>
                  <option value="frequency">Frequency</option>
                  <option value="timeLimit">Time Limit</option>
                </select>
                <button
                  onClick={() => setSortDirection(current => current === 'asc' ? 'desc' : 'asc')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ArrowUpDown
                    className={`w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                  />
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {filteredTasks.length} tasks total
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Group tasks by category */}
          {categories.map(category => {
            const categoryTasks = getSortedTasks(
              filteredTasks.filter(task => task.category === category)
            );
            if (categoryTasks.length === 0) return null;

            return (
              <div key={category} className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">{category}</h3>
                  <span className="text-sm text-gray-500">({categoryTasks.length})</span>
                </div>
                
                {/* Task Cards */}
                <div className="space-y-3">
                  {categoryTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900">{task.name}</h4>
                          {task.notes && (
                            <p className="text-sm text-gray-600">{task.notes}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {task.frequency}
                            </span>
                            {task.timeLimit && (
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Timer className="w-4 h-4" />
                                {task.timeLimit} min
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {/* XP Values */}
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              8yr: {task.xpYoung} XP
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              11yr: {task.xpOld} XP
                            </span>
                          </div>
                          
                          {/* Requirements */}
                          <div className="flex gap-1">
                            {task.requiresPhoto && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                                Photo
                              </span>
                            )}
                            {task.requiresParentApproval && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                Approval
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleDuplicateTask(task)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                              title="Duplicate Task"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 hover:bg-gray-100 rounded text-blue-500 hover:text-blue-700"
                              title="Edit Task"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 hover:bg-gray-100 rounded text-red-500 hover:text-red-700"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks found for the selected filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Selection Modal */}
      {isTemplateSelectOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Quick Add from Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(taskTemplates).map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      handleTemplateSelect(category);
                      setIsTemplateSelectOpen(false);
                    }}
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h3 className="font-semibold">{category} Template</h3>
                    <p className="text-sm text-gray-600">
                      Add common {category.toLowerCase()} tasks
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsTemplateSelectOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Task Modal - Now with taskToEdit properly passed */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        taskToEdit={taskToEdit}
      />

      {/* Template Builder Modal */}
      <TemplateBuilder
        isOpen={isTemplateBuilderOpen}
        onClose={() => setIsTemplateBuilderOpen(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default TaskManagement;