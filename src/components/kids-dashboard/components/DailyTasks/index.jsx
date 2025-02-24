// src/components/kids-dashboard/components/DailyTasks/index.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import TaskCard from './TaskCard';
import { getTaskStatus } from '../TaskHelpers/statusHelpers';

const DailyTasks = ({ 
  tasks, 
  setTasks, 
  dailyXP, 
  maxDailyXP, 
  currentUser, 
  onTaskComplete 
}) => {
  // Handle task click/selection
  const handleTaskClick = (taskId) => {
    if (dailyXP >= maxDailyXP) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || (task.completed && !task.denied)) return;
    
    // For denied tasks, reset status to try again
    if (task.denied) {
      setTasks(prevTasks =>
        prevTasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              denied: false,
              feedback: null,
              completed: false,
              selected: true,
              status: 'in-progress'
            };
          }
          return t;
        })
      );
      return;
    }
    
    // For available tasks, toggle selected state
    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, selected: !t.selected };
        }
        return t;
      })
    );
  };

  // Handle task submission
  const handleSubmitTask = async (taskId, e) => {
    e.stopPropagation();
    await onTaskComplete(taskId);
  };

  return (
    <div className="col-span-2 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-blue-500" />
            Today's Quests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map(task => {
              const status = getTaskStatus(task);
              const isDisabled = dailyXP >= maxDailyXP && !task.completed;
              
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  status={status}
                  isDisabled={isDisabled}
                  onClick={() => !isDisabled && status !== 'approved' && handleTaskClick(task.id)}
                  onSubmit={(e) => handleSubmitTask(task.id, e)}
                />
              );
            })}

            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No quests available right now. Check back tomorrow for new adventures!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTasks;