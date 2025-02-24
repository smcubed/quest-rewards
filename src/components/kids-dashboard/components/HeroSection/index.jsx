// src/components/kids-dashboard/components/HeroSection/index.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import ProgressBars from './ProgressBars';

const HeroSection = ({ currentUser, levelProgress, dailyXP, maxDailyXP }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, Hero {currentUser?.name}!
            </h1>
            <p className="text-lg opacity-90">
              Level {levelProgress.currentLevel} Adventurer
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <div className="text-3xl font-bold">{currentUser?.currentXP}</div>
              <div className="text-lg opacity-90">XP</div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <div className="text-2xl font-bold text-yellow-300">{currentUser?.goldCoins || 0}</div>
              <div className="text-sm opacity-90">Gold</div>
            </div>
          </div>
        </div>

        <ProgressBars
          levelProgress={levelProgress}
          dailyXP={dailyXP}
          maxDailyXP={maxDailyXP}
        />
      </CardContent>
    </Card>
  );
};

export default HeroSection;