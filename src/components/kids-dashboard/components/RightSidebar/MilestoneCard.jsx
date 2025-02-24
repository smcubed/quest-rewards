// src/components/kids-dashboard/components/RightSidebar/MilestoneCard.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

const MilestoneCard = ({ levelProgress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="text-green-500" />
          Next Big Quest
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4">
          <div className="font-medium mb-2">
            {levelProgress.isMaxLevel ? (
              "Maximum Level Reached!"
            ) : (
              `${levelProgress.xpToNextLevel} XP to Level ${levelProgress.currentLevel + 1}!`
            )}
          </div>
          <div className="text-sm text-gray-600">
            Keep up the great work!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneCard;