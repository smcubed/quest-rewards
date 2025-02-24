import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Helper function to calculate level based on XP
const calculateLevel = (xp) => {
  const levels = [
    { level: 1, requirement: 0 },
    { level: 2, requirement: 500 },
    { level: 3, requirement: 1250 },
    { level: 4, requirement: 2500 },
    { level: 5, requirement: 4000 },
    { level: 6, requirement: 6000 },
    { level: 7, requirement: 8500 },
    { level: 8, requirement: 11500 },
    { level: 9, requirement: 15000 },
    { level: 10, requirement: 19000 }
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].requirement) {
      return levels[i].level;
    }
  }
  
  return 1; // Default to level 1
};

// Calculate gold bonus for level up
const calculateLevelUpGoldBonus = (level) => {
  if (level <= 1) return 0;
  if (level === 2) return 50;
  if (level === 3) return 100;
  if (level === 4) return 150;
  if (level === 5) return 200;
  return 250 + (level - 5) * 50;
};

// Calculate gold bonus for streaks
const calculateStreakGoldBonus = (streak) => {
  if (streak >= 30) return 200;
  if (streak >= 14) return 75;
  if (streak >= 7) return 30;
  if (streak >= 3) return 10;
  return 0;
};

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Initialize tasks if none exist
  useEffect(() => {
    const initializeTasks = () => {
      const storedTasks = localStorage.getItem('quest-rewards-tasks');
      if (!storedTasks || JSON.parse(storedTasks).length === 0) {
        // Import predefined tasks and add IDs
        const initializedTasks = predefinedTasks.map(task => ({
          ...task,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          completed: false,
          completedBy: null,
          completedAt: null,
          verified: false,
          denied: false,
          feedback: null,
          status: 'available',
          lastUpdated: new Date().toISOString()
        }));
        
        setTasks(initializedTasks);
        localStorage.setItem('quest-rewards-tasks', JSON.stringify(initializedTasks));
      } else {
        setTasks(JSON.parse(storedTasks));
      }
      setLoading(false);
    };

    initializeTasks();
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('quest-rewards-tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const addTask = async (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      completed: false,
      completedBy: null,
      completedAt: null,
      verified: false,
      denied: false,
      feedback: null,
      status: 'available',
      lastUpdated: new Date().toISOString()
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  };

  const completeTask = async (taskId, completionData = {}) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return null;

      // Check both possible property names
      const needsApproval = task.requiresParentApproval || task.requiresPhoto;
      
      const updatedTask = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString(),
        completedBy: currentUser?.id,
        verified: !needsApproval,
        status: needsApproval ? 'pending-review' : 'approved',
        denied: false,
        feedback: null,
        lastUpdated: new Date().toISOString(),
        ...completionData
      };

      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );

      // If task doesn't require parent approval, award XP immediately
      if (!needsApproval && currentUser?.id) {
        // Get auth data from localStorage
        const authData = JSON.parse(localStorage.getItem('quest-rewards-auth') || '{}');
        const children = authData.children || [];
        
        // Find the current user/child
        const child = children.find(c => c.id === currentUser.id);
        
        if (child) {
          // Calculate XP and Gold based on child's age
          const xpAmount = child.age <= 8 ? task.xpYoung : task.xpOld;
          const goldAmount = child.age <= 8 ? (task.goldYoung || task.xpYoung) : (task.goldOld || task.xpOld);
          
          // Calculate new values
          const currentXP = child.currentXP || 0;
          const newXP = currentXP + xpAmount;
          const newLevel = calculateLevel(newXP);
          
          // Calculate current gold
          const currentGold = child.goldCoins || 0;
          
          // Check for level up
          const didLevelUp = newLevel > (child.level || 1);
          let levelUpGoldBonus = 0;
          
          if (didLevelUp) {
            levelUpGoldBonus = calculateLevelUpGoldBonus(newLevel);
          }
          
          // Calculate streak bonuses (could be enhanced to track per-category streaks)
          const streakGoldBonus = 0; // We'll implement streak tracking later
                  
          // Update the child's XP, level, and gold
          const updatedChildren = children.map(c => 
            c.id === child.id 
              ? {
                  ...c,
                  currentXP: newXP,
                  level: newLevel,
                  goldCoins: currentGold + goldAmount + levelUpGoldBonus + streakGoldBonus
                } 
              : c
          );
          
          // Save updated data back to localStorage
          authData.children = updatedChildren;
          localStorage.setItem('quest-rewards-auth', JSON.stringify(authData));
          
          // If we have a notification system, show level up or XP gain notification
          if (didLevelUp) {
            console.log(`${child.name} leveled up to level ${newLevel}! Bonus: ${levelUpGoldBonus} Gold`);
            // Here you could dispatch a notification event
          }
        }
      }

      return updatedTask;
    } catch (error) {
      console.error('Error completing task:', error);
      return null;
    }
  };

  const verifyTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;

      const updatedTask = {
        ...task,
        verified: true,
        denied: false,
        feedback: null,
        verifiedAt: new Date().toISOString(),
        status: 'approved',
        lastUpdated: new Date().toISOString()
      };

      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
      
      // Add XP and Gold to the child who completed the task
      if (task.completedBy) {
        // Get auth data from localStorage
        const authData = JSON.parse(localStorage.getItem('quest-rewards-auth') || '{}');
        const children = authData.children || [];
        
        // Find the child who completed the task
        const child = children.find(c => c.id === task.completedBy);
        
        if (child) {
          // Calculate XP and Gold based on child's age
          const xpAmount = child.age <= 8 ? task.xpYoung : task.xpOld;
          const goldAmount = child.age <= 8 ? (task.goldYoung || task.xpYoung) : (task.goldOld || task.xpOld);
          
          // Calculate new XP and level
          const currentXP = child.currentXP || 0;
          const newXP = currentXP + xpAmount;
          const newLevel = calculateLevel(newXP);
          
          // Calculate current gold
          const currentGold = child.goldCoins || 0;
          
          // Check for level up
          const didLevelUp = newLevel > (child.level || 1);
          let levelUpGoldBonus = 0;
          
          if (didLevelUp) {
            levelUpGoldBonus = calculateLevelUpGoldBonus(newLevel);
          }
          
          // Calculate streak bonuses (could be enhanced to track per-category streaks)
          const streakGoldBonus = 0; // We'll implement streak tracking later
                  
          // Update the child's XP, level, and gold
          const updatedChildren = children.map(c => 
            c.id === child.id 
              ? {
                  ...c,
                  currentXP: newXP,
                  level: newLevel,
                  goldCoins: currentGold + goldAmount + levelUpGoldBonus + streakGoldBonus
                } 
              : c
          );
          
          // Save updated data back to localStorage
          authData.children = updatedChildren;
          localStorage.setItem('quest-rewards-auth', JSON.stringify(authData));
          
          // If we have a notification system, show level up or XP gain notification
          if (didLevelUp) {
            console.log(`${child.name} leveled up to level ${newLevel}! Bonus: ${levelUpGoldBonus} Gold`);
            // Here you could dispatch a notification event
          }
          
          if (streakGoldBonus > 0) {
            console.log(`${child.name} earned a streak bonus of ${streakGoldBonus} Gold!`);
            // Here you could dispatch a notification event
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error verifying task:', error);
      return false;
    }
  };

  const denyTask = async (taskId, feedback) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;

      const updatedTask = {
        ...task,
        denied: true,
        verified: false,
        feedback,
        status: 'denied',
        lastUpdated: new Date().toISOString()
      };

      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );

      return true;
    } catch (error) {
      console.error('Error denying task:', error);
      return false;
    }
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, lastUpdated: new Date().toISOString() }
          : task
      )
    );
  };

  const refreshTasks = (force = false) => {
    const today = new Date().toLocaleDateString();
    const lastRefreshDate = localStorage.getItem('lastTaskRefreshDate');

    if (force || lastRefreshDate !== today) {
      // Only reset tasks that are not pending review or denied
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.frequency === 'Daily' && 
              task.status !== 'pending-review' && 
              task.status !== 'denied') {
            return {
              ...task,
              completed: false,
              verified: false,
              selected: false,
              completedBy: null,
              completedAt: null,
              status: 'available',
              lastUpdated: new Date().toISOString()
            };
          }
          return task;
        })
      );

      localStorage.setItem('lastTaskRefreshDate', today);
    }
  };

  const getPendingVerifications = () => {
    return tasks.filter(task =>
      task.completed &&
      (task.requiresParentApproval || task.requiresPhoto) &&
      !task.verified &&
      !task.denied &&
      task.status === 'pending-review'
    );
  };

  const getTasksByChild = (childId) => {
    return tasks.filter(task =>
      task.assignedTo?.includes(childId) ||
      (task.shared && (!task.completedBy || task.completedBy === childId))
    );
  };

  const getTasksByCategory = (category) => {
    if (category === 'all') return tasks;
    return tasks.filter(task => task.category === category);
  };

  const getTasksByFrequency = (frequency) => {
    if (frequency === 'all') return tasks;
    return tasks.filter(task => task.frequency === frequency);
  };

  const getDailyTasks = (childId = currentUser?.id) => {
    const today = new Date().toLocaleDateString();
    return tasks.filter(task => 
      task.frequency === 'Daily' &&
      (
        // Task is not completed by anyone
        !task.completedBy ||
        // OR task is completed by this specific child
        task.completedBy === childId
      ) &&
      // Only today's tasks
      (!task.completedAt || new Date(task.completedAt).toLocaleDateString() === today)
    );
  };

  const getCompletedTasks = (childId) => {
    return tasks.filter(task =>
      task.completed &&
      task.verified &&
      task.completedBy === childId
    );
  };

  const getTaskCompletion = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    return {
      completed: task.completed,
      completedAt: task.completedAt,
      completedBy: task.completedBy,
      verified: task.verified,
      denied: task.denied,
      feedback: task.feedback,
      status: task.status
    };
  };

  const value = {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    completeTask,
    verifyTask,
    denyTask,
    refreshTasks,
    getTasksByChild,
    getTasksByCategory,
    getTasksByFrequency,
    getDailyTasks,
    getCompletedTasks,
    getPendingVerifications,
    getTaskCompletion,
    loading
  };

  return (
    <TaskContext.Provider value={value}>
      {!loading && children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

// Predefined tasks
const predefinedTasks = [
  // Personal Care Tasks
  {
    name: "Morning Routine",
    category: "Personal Care",
    frequency: "Daily",
    xpYoung: 10,
    xpOld: 5,
    goldYoung: 10,
    goldOld: 5,
    requiresPhoto: false,
    requiresParentApproval: false,
    timeLimit: 15,
    notes: "Brush teeth, wash face, get dressed"
  },
  {
    name: "Evening Routine",
    category: "Personal Care",
    frequency: "Daily",
    xpYoung: 10,
    xpOld: 5,
    goldYoung: 10,
    goldOld: 5,
    requiresPhoto: false,
    requiresParentApproval: false,
    timeLimit: 15,
    notes: "Brush teeth, wash face, pajamas"
  },
  // Organization Tasks
  {
    name: "Clean Room",
    category: "Organization",
    frequency: "Daily",
    xpYoung: 15,
    xpOld: 10,
    goldYoung: 15,
    goldOld: 10,
    requiresPhoto: true,
    requiresParentApproval: true,
    timeLimit: 20,
    notes: "Make bed, pick up toys, organize desk"
  },
  // Pet Care Tasks
  {
    name: "Feed Bailey",
    category: "Pet Care",
    frequency: "Daily",
    xpYoung: 10,
    xpOld: 10,
    goldYoung: 10,
    goldOld: 10,
    requiresPhoto: false,
    requiresParentApproval: false,
    timeLimit: 5,
    notes: "Morning and evening feeding"
  },
  {
    name: "Walk Bailey",
    category: "Pet Care",
    frequency: "Daily",
    xpYoung: 15,
    xpOld: 15,
    goldYoung: 15,
    goldOld: 15,
    requiresPhoto: false,
    requiresParentApproval: false,
    timeLimit: 20,
    notes: "20-minute walk"
  }
];

export default TaskProvider;