import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import _ from 'lodash';
import { calculateLevelProgress } from '../../utils/level-calculations';

const HeroStats = () => {
  const { tasks } = useTasks();
  const { currentUser } = useAuth();

  const stats = useMemo(() => {
    // Get current user's tasks
    const userTasks = tasks.filter(task => 
      task.completedBy === currentUser?.id
    );

    // Calculate daily streak
    const today = new Date();
    const tasksByDate = _.groupBy(userTasks, task => 
      new Date(task.completedAt).toDateString()
    );
    
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      const dateStr = currentDate.toDateString();
      const tasksOnDate = tasksByDate[dateStr] || [];
      
      if (tasksOnDate.length === 0) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate daily quests
    const todayStr = today.toDateString();
    const dailyTasksTotal = tasks.filter(task => 
      task.frequency === 'Daily' && 
      (!task.completedBy || task.completedBy === currentUser?.id)
    ).length;
    
    const dailyTasksCompleted = (tasksByDate[todayStr] || []).length;

    // Calculate total quests completed
    const totalTasksCompleted = userTasks.length;

    // Calculate best category
    const categoryCounts = _.countBy(userTasks, 'category');
    const bestCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    // Calculate level progress
    const levelInfo = calculateLevelProgress(currentUser?.currentXP || 0);

    return {
      streak,
      dailyCompleted: dailyTasksCompleted,
      dailyTotal: dailyTasksTotal,
      totalCompleted: totalTasksCompleted,
      bestCategory,
      levelInfo
    };
  }, [tasks, currentUser]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Hero Stats</span>
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Level {stats.levelInfo.currentLevel}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Level Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Level Progress</span>
              {stats.levelInfo.isMaxLevel ? (
                <span>Max Level Reached!</span>
              ) : (
                <span>{stats.levelInfo.xpToNextLevel} XP to Next Level</span>
              )}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  stats.levelInfo.isMaxLevel ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${stats.levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Daily Streak</span>
            <span className="font-bold">{stats.streak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Daily Quests Completed</span>
            <span className="font-bold">{stats.dailyCompleted}/{stats.dailyTotal}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Quests Completed</span>
            <span className="font-bold">{stats.totalCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Best Category</span>
            <span className="font-bold">{stats.bestCategory}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroStats;