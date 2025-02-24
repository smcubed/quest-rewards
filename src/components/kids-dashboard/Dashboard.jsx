// src/components/kids-dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { calculateLevelProgress } from '../../utils/level-calculations.js';

// Import components
import HeroSection from './components/HeroSection';
import DailyTasks from './components/DailyTasks';
import RightSidebar from './components/RightSidebar';

// Constants
const MAX_DAILY_XP = 250;

const KidsDashboard = () => {
  // Hooks
  const { currentUser } = useAuth();
  const { tasks, completeTask, refreshTasks, getDailyTasks } = useTasks();
  
  // State
  const [dailyTasks, setDailyTasks] = useState([]);
  const [dailyXP, setDailyXP] = useState(0);
  
  // Computed values
  const levelProgress = useMemo(() => 
    calculateLevelProgress(currentUser?.currentXP || 0), 
    [currentUser]
  );

  // Load tasks and calculate XP
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastRefreshDate = localStorage.getItem('lastTaskRefreshDate');

    if (lastRefreshDate !== today) {
      refreshTasks();
    }

    const todaysCompletedTasks = tasks.filter(task => 
      task.completed &&
      task.verified &&
      task.completedBy === currentUser?.id &&
      new Date(task.completedAt).toLocaleDateString() === today
    );

    const totalDailyXP = todaysCompletedTasks.reduce((sum, task) => 
      sum + (currentUser.age <= 8 ? task.xpYoung : task.xpOld), 0
    );

    setDailyXP(totalDailyXP);

    const availableTasks = getDailyTasks(currentUser.id).map(task => ({
      ...task,
      xp: currentUser.age <= 8 ? task.xpYoung : task.xpOld
    }));

    setDailyTasks(availableTasks);
  }, [tasks, currentUser, refreshTasks, getDailyTasks]);

  // Handler for completing tasks
  const handleTaskComplete = async (taskId) => {
    const task = dailyTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await completeTask(taskId, {
        completedAt: new Date().toISOString(),
        completedBy: currentUser.id
      });

      // Update local state
      setDailyTasks(prevTasks =>
        prevTasks.map(t => 
          t.id === taskId
            ? { ...t, completed: true }
            : t
        )
      );
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl p-4 mx-auto space-y-4">
      <HeroSection
        currentUser={currentUser}
        levelProgress={levelProgress}
        dailyXP={dailyXP}
        maxDailyXP={MAX_DAILY_XP}
      />

      <div className="grid grid-cols-3 gap-4">
        <DailyTasks
          className="col-span-2"
          tasks={dailyTasks}
          setTasks={setDailyTasks}
          dailyXP={dailyXP}
          maxDailyXP={MAX_DAILY_XP}
          currentUser={currentUser}
          onTaskComplete={handleTaskComplete}
        />
        
        <RightSidebar
          levelProgress={levelProgress}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default KidsDashboard;