// utils/level-calculations.js
export const calculateLevelProgress = (currentXP) => {
  // Define XP requirements for all 10 levels
  const levels = {
    1: 500,    // Level 1 -> 2
    2: 1250,   // Level 2 -> 3
    3: 2500,   // Level 3 -> 4
    4: 4000,   // Level 4 -> 5
    5: 6000,   // Level 5 -> 6
    6: 8500,   // Level 6 -> 7
    7: 11500,  // Level 7 -> 8
    8: 15000,  // Level 8 -> 9
    9: 19000,  // Level 9 -> 10
    10: 23500  // Max level
  };

  // Find current level
  let currentLevel = 1;
  let nextLevelXP = levels[1];

  for (const [level, requirement] of Object.entries(levels)) {
    if (currentXP >= requirement) {
      currentLevel = parseInt(level) + 1;
      nextLevelXP = levels[currentLevel] || requirement; // At max level, use final threshold
    } else {
      nextLevelXP = requirement;
      break;
    }
  }

  // Calculate progress to next level
  const previousLevelXP = levels[currentLevel - 1] || 0;
  const xpForNextLevel = nextLevelXP - previousLevelXP;
  const xpProgress = currentXP - previousLevelXP;
  const progressPercent = (xpProgress / xpForNextLevel) * 100;

  // Handle max level case
  const isMaxLevel = currentLevel === 10;

  return {
    currentLevel,
    nextLevelXP,
    previousLevelXP,
    xpForNextLevel,
    xpProgress,
    progressPercent: isMaxLevel ? 100 : Math.min(100, Math.max(0, progressPercent)),
    xpToNextLevel: isMaxLevel ? 0 : nextLevelXP - currentXP,
    isMaxLevel
  };
};