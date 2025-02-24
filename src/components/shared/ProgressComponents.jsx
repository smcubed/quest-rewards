import React from 'react';
import {
  Star,
  Award,
  Medal,
  Target,
  TrendingUp
} from 'lucide-react';

// XP Progress Bar Component
export const XPProgressBar = ({ currentXP, levelUpXP, showNumbers = true }) => {
  const progress = (currentXP / levelUpXP) * 100;
  
  return (
    <div className="space-y-2">
      {showNumbers && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{currentXP} XP</span>
          <span>{levelUpXP} XP</span>
        </div>
      )}
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Level Badge Component
export const LevelBadge = ({ level, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-lg'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
      <div className="absolute inset-0.5 bg-white rounded-full" />
      <div className="relative flex flex-col items-center justify-center">
        <span className="font-bold text-gray-900">{level}</span>
        <span className="text-xs text-gray-600">Level</span>
      </div>
    </div>
  );
};

// Achievement Badge Component
export const AchievementBadge = ({
  title,
  description,
  icon,
  achieved,
  progress = null
}) => {
  return (
    <div className={`p-4 rounded-lg border ${
      achieved ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
               : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${
          achieved ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-400'
        }`}>
          {icon || <Medal className="w-6 h-6" />}
        </div>
        <div>
          <h3 className={`font-semibold ${
            achieved ? 'text-purple-900' : 'text-gray-700'
          }`}>
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
          
          {progress !== null && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Streak Counter Component
export const StreakCounter = ({ count, type = 'days' }) => {
  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full">
      <TrendingUp className="w-4 h-4" />
      <span className="font-medium">{count}</span>
      <span className="text-sm">{type} streak!</span>
    </div>
  );
};

// Stats Display Component
export const StatsDisplay = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg border border-gray-200 text-center"
        >
          <div className="flex justify-center mb-2">
            {stat.icon || <Target className="w-5 h-5 text-blue-500" />}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Milestone Progress Component
export const MilestoneProgress = ({ milestones }) => {
  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => (
        <div key={index} className="relative">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              milestone.achieved
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
              <p className="text-sm text-gray-600">{milestone.description}</p>
            </div>
            {milestone.achieved && (
              <Star className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          {index < milestones.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
          )}
        </div>
      ))}
    </div>
  );
};

// Example usage wrapper component
export const ProgressSection = ({
  currentXP,
  levelUpXP,
  level,
  achievements,
  stats,
  milestones
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <LevelBadge level={level} size="large" />
        <div className="flex-1">
          <XPProgressBar
            currentXP={currentXP}
            levelUpXP={levelUpXP}
          />
        </div>
      </div>

      <StatsDisplay stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <AchievementBadge
            key={index}
            {...achievement}
          />
        ))}
      </div>

      <MilestoneProgress milestones={milestones} />
    </div>
  );
};
