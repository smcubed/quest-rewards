import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer, PageHeader, Section } from '@/components/ui/layout';
import { ProgressBar, ActionButton } from '@/components/ui/shared';
import {
  Trophy,
  Star,
  Award,
  Medal,
  Shield,
  Target,
  Clock,
  CheckCircle,
  Lock
} from 'lucide-react';

const AchievementCard = ({ achievement }) => {
  const isLocked = achievement.hidden && !achievement.completed;

  return (
    <Card className="overflow-hidden">
      <div className={`bg-gradient-to-r ${
        achievement.completed
          ? 'from-purple-500 to-indigo-500'
          : 'from-gray-500 to-gray-600'
      } p-6 text-white`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              {achievement.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">
                {isLocked ? "???" : achievement.name}
              </h3>
              <p className="text-white/80">
                {isLocked ? "Keep playing to unlock!" : achievement.description}
              </p>
            </div>
          </div>
          {!isLocked && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-lg">{achievement.xpReward} XP</span>
            </div>
          )}
        </div>
      </div>

      {!isLocked && !achievement.completed && (
        <CardContent>
          <ProgressBar
            value={achievement.progress}
            max={achievement.target}
            className="mt-2"
          />
        </CardContent>
      )}

      {achievement.completed && (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Completed!</span>
          </div>
          <Medal className="w-6 h-6 text-yellow-500" />
        </div>
      )}
    </Card>
  );
};

const AchievementSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [achievements] = useState({
    daily: [
      {
        id: 1,
        name: "Early Bird",
        description: "Complete morning routine 7 days in a row",
        category: "daily",
        progress: 5,
        target: 7,
        xpReward: 500,
        icon: <Clock className="w-6 h-6" />,
        rarity: "common",
        completed: false
      },
      {
        id: 2,
        name: "Pet Care Pro",
        description: "Take care of Bailey for 14 days straight",
        category: "daily",
        progress: 14,
        target: 14,
        xpReward: 1000,
        icon: <Shield className="w-6 h-6" />,
        rarity: "rare",
        completed: true
      }
    ],
    special: [
      {
        id: 3,
        name: "Homework Hero",
        description: "Complete all homework for a month",
        category: "special",
        progress: 18,
        target: 30,
        xpReward: 2000,
        icon: <Star className="w-6 h-6" />,
        rarity: "epic",
        completed: false
      }
    ],
    secret: [
      {
        id: 4,
        name: "???",
        description: "This achievement is still locked",
        category: "secret",
        progress: 0,
        target: 1,
        xpReward: 1500,
        icon: <Lock className="w-6 h-6" />,
        rarity: "legendary",
        completed: false,
        hidden: true
      }
    ]
  });

  const categories = [
    { id: 'all', name: 'All Achievements' },
    { id: 'daily', name: 'Daily Achievements' },
    { id: 'special', name: 'Special Achievements' },
    { id: 'secret', name: 'Secret Achievements' }
  ];

  const totalAchievements = Object.values(achievements).flat().length;
  const completedAchievements = Object.values(achievements)
    .flat()
    .filter(a => a.completed)
    .length;

  return (
    <PageContainer>
      <PageHeader
        title="Achievements"
        description="Track your heroic deeds!"
        action={
          <div className="text-right">
            <div className="text-3xl font-bold">{completedAchievements}/{totalAchievements}</div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
          </div>
        }
      />

      {/* Category Navigation */}
      <Section>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium text-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Achievement Grid */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(achievements).map(([category, categoryAchievements]) =>
            categoryAchievements
              .filter(() => selectedCategory === 'all' || selectedCategory === category)
              .map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))
          )}
        </div>
      </Section>
    </PageContainer>
  );
};

export default AchievementSystem;
