import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Star,
  Award,
  Medal,
  Clock,
  Gift,
  DollarSign,
  ArrowRight,
  Lock,
  Shield
} from 'lucide-react';

const RewardShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [playerStats] = useState({
    name: 'Finn',
    level: 4,
    currentXP: 3750,
    bankedXP: 2500
  });

  const [rewards] = useState({
    standard: [
      {
        id: 1,
        name: 'Extra Screen Time',
        description: '30 minutes of additional screen time',
        xpCost: 750,
        type: 'standard',
        level: 1,
        icon: <Clock className="w-6 h-6" />
      },
      {
        id: 2,
        name: 'Choose Dinner',
        description: 'Pick dinner for the whole family',
        xpCost: 1250,
        type: 'standard',
        level: 1,
        icon: <Star className="w-6 h-6" />
      },
      {
        id: 3,
        name: 'Cash Out',
        description: 'Convert XP to $10',
        xpCost: 1500,
        type: 'standard',
        level: 2,
        icon: <DollarSign className="w-6 h-6" />
      }
    ],
    elite: [
      {
        id: 4,
        name: 'New Video Game',
        description: 'Choose a new video game',
        xpCost: 6000,
        type: 'elite',
        level: 3,
        icon: <Gift className="w-6 h-6" />
      },
      {
        id: 5,
        name: 'Friend Sleepover',
        description: 'Have a friend sleep over',
        xpCost: 7500,
        type: 'elite',
        level: 3,
        icon: <Star className="w-6 h-6" />
      }
    ],
    special: [
      {
        id: 6,
        name: 'Weekend Adventure',
        description: 'Special weekend activity of your choice',
        xpCost: 5000,
        type: 'special',
        timeLimit: '3 days left',
        level: 2,
        icon: <Award className="w-6 h-6" />
      }
    ]
  });

  const canAffordReward = (cost) => {
    return playerStats.currentXP + playerStats.bankedXP >= cost;
  };

  const isLevelUnlocked = (requiredLevel) => {
    return playerStats.level >= requiredLevel;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Reward Shop</h1>
              <p className="text-lg opacity-90">Welcome, {playerStats.name}!</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{playerStats.currentXP} XP</div>
              <div className="text-sm opacity-90">Available to Spend</div>
              {playerStats.bankedXP > 0 && (
                <div className="text-sm mt-1">+{playerStats.bankedXP} XP Banked</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'standard', 'elite', 'special'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Rewards
          </button>
        ))}
      </div>

      {/* Special Rewards Section */}
      {(selectedCategory === 'all' || selectedCategory === 'special') && (
        <Card className="border-2 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Limited Time Rewards!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.special.map((reward) => (
                <SpecialRewardCard
                  key={reward.id}
                  reward={reward}
                  canAfford={canAffordReward(reward.xpCost)}
                  isUnlocked={isLevelUnlocked(reward.level)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Rewards */}
      {(selectedCategory === 'all' || selectedCategory === 'standard') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              Standard Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.standard.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canAfford={canAffordReward(reward.xpCost)}
                  isUnlocked={isLevelUnlocked(reward.level)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elite Rewards */}
      {(selectedCategory === 'all' || selectedCategory === 'elite') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-purple-500" />
              Elite Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.elite.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canAfford={canAffordReward(reward.xpCost)}
                  isUnlocked={isLevelUnlocked(reward.level)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Regular Reward Card Component
const RewardCard = ({ reward, canAfford, isUnlocked }) => {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      !isUnlocked ? 'bg-gray-50 border-gray-200' :
      canAfford ? 'bg-white border-purple-200 hover:border-purple-400' :
      'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-full ${
          !isUnlocked ? 'bg-gray-200' :
          canAfford ? 'bg-purple-100' : 'bg-gray-200'
        }`}>
          {reward.icon}
        </div>
        <div className="flex items-center gap-1 text-purple-600 font-bold">
          <Star className="w-4 h-4" />
          {reward.xpCost} XP
        </div>
      </div>

      <h3 className="font-bold mb-1">{reward.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

      {!isUnlocked ? (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Unlocks at Level {reward.level}</span>
        </div>
      ) : (
        <button
          disabled={!canAfford}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            canAfford
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canAfford ? (
            <>
              Claim Reward
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            'Not Enough XP'
          )}
        </button>
      )}
    </div>
  );
};

// Special Reward Card Component
const SpecialRewardCard = ({ reward, canAfford, isUnlocked }) => {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      !isUnlocked ? 'bg-gray-50 border-gray-200' :
      canAfford ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-400' :
      'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-full ${
          !isUnlocked ? 'bg-gray-200' :
          canAfford ? 'bg-yellow-100' : 'bg-gray-200'
        }`}>
          {reward.icon}
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {reward.timeLimit}
          </div>
        </div>
      </div>

      <h3 className="font-bold mb-1">{reward.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 text-yellow-600 font-bold">
          <Star className="w-4 h-4" />
          {reward.xpCost} XP
        </div>
        <Shield className="w-4 h-4 text-yellow-500" />
      </div>

      {!isUnlocked ? (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Unlocks at Level {reward.level}</span>
        </div>
      ) : (
        <button
          disabled={!canAfford}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            canAfford
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canAfford ? (
            <>
              Claim Special Reward
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            'Not Enough XP'
          )}
        </button>
      )}
    </div>
  );
};

export default RewardShop;
