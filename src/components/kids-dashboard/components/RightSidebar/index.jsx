// src/components/kids-dashboard/components/RightSidebar/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Gift, Target } from 'lucide-react';
import HeroStats from '../../HeroStats';
import MilestoneCard from './MilestoneCard';

const RightSidebar = ({ levelProgress }) => {
  const navigate = useNavigate();

  const handleRewardShopClick = () => {
    navigate('/kids/rewards');
  };

  return (
    <div className="space-y-4">
      {/* Hero Stats */}
      <HeroStats />

      {/* Rewards Shop Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="text-purple-500" />
            Treasure Shop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button 
            onClick={handleRewardShopClick}
            className="w-full p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            See Available Treasures!
          </button>
        </CardContent>
      </Card>

      {/* Next Milestone */}
      <MilestoneCard levelProgress={levelProgress} />
    </div>
  );
};

export default RightSidebar;