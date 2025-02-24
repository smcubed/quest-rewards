import { differenceInDays, isToday, parseISO, startOfDay } from 'date-fns';

export const calculateXP = (task, userLevel) => {
  let xp = task.baseXP;

  // Apply level multiplier
  xp *= (1 + (userLevel - 1) * 0.1);

  // Apply streak bonus
  if (task.streak) {
    xp *= (1 + task.streak * 0.05);
  }

  return Math.round(xp);
};

export const calculateStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;

  let streak = 0;
  const today = startOfDay(new Date());
  let checkDate = today;

  for (const completion of completions.sort((a, b) => new Date(b.date) - new Date(a.date))) {
    const completionDate = startOfDay(parseISO(completion.date));
    const dayDiff = differenceInDays(checkDate, completionDate);

    if (dayDiff === 0 || dayDiff === 1) {
      streak++;
      checkDate = completionDate;
    } else {
      break;
    }
  }

  return streak;
};

export const getDailyTasks = (tasks, userId) => {
  return tasks.filter(task => {
    const isAssigned = task.assignedTo.includes(userId);
    const isAvailable = !task.completedBy || task.completedBy === userId;
    const isDueToday = !task.dueDate || isToday(parseISO(task.dueDate));
    return isAssigned && isAvailable && isDueToday;
  });
};

export const getPendingVerifications = (tasks) => {
  return tasks.filter(task =>
    task.completed &&
    task.requiresVerification &&
    !task.verified
  );
};

export const calculateDailyXP = (completedTasks) => {
  return completedTasks
    .filter(task => isToday(parseISO(task.completedAt)))
    .reduce((total, task) => total + task.xpValue, 0);
};

export const getTasksByCategory = (tasks, category) => {
  if (category === 'all') return tasks;
  return tasks.filter(task => task.category === category);
};

export const checkDailyXPCap = (currentXP, newXP, dailyXPCap) => {
  const totalXP = currentXP + newXP;
  return totalXP > dailyXPCap ? dailyXPCap - currentXP : newXP;
};

export const getFutureScheduledTasks = (tasks) => {
  return tasks.filter(task =>
    task.dueDate && new Date(task.dueDate) > new Date()
  ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

export default {
  calculateXP,
  calculateStreak,
  getDailyTasks,
  getPendingVerifications,
  calculateDailyXP,
  getTasksByCategory,
  checkDailyXPCap,
  getFutureScheduledTasks
};
