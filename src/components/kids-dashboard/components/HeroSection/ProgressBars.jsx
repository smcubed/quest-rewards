// src/components/kids-dashboard/components/HeroSection/ProgressBars.jsx

import React from 'react';

const ProgressBar = ({ value, max, label, color = 'blue' }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span>{label}</span>
      <span>{value}/{max}</span>
    </div>
    <div className="w-full bg-white/20 rounded-full h-4">
      <div
        className={`rounded-full h-4 transition-all duration-500 bg-${color}-400`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  </div>
);

const ProgressBars = ({ levelProgress, dailyXP, maxDailyXP }) => {
  return (
    <div className="mt-6 space-y-4">
      {/* Level Progress */}
      <ProgressBar
        value={levelProgress.currentLevel}
        max={levelProgress.isMaxLevel ? levelProgress.currentLevel : levelProgress.currentLevel + 1}
        label={levelProgress.isMaxLevel 
          ? "Max Level!" 
          : `${levelProgress.xpToNextLevel} XP to Level ${levelProgress.currentLevel + 1}`
        }
        color="yellow"
      />

      {/* Daily XP Progress */}
      <ProgressBar
        value={dailyXP}
        max={maxDailyXP}
        label="Daily XP Progress"
        color={dailyXP >= maxDailyXP ? "green" : "blue"}
      />

      {dailyXP >= maxDailyXP && (
        <div className="text-sm mt-1 text-white/90">
          Daily XP limit reached! Great job! Come back tomorrow for more quests.
        </div>
      )}
    </div>
  );
};

export default ProgressBars;
