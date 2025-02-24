import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Star,
  Award,
  Shield,
  Sword,
  Timer,
  Camera,
  CheckCircle,
  Medal,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

const TaskView = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [playerStats] = useState({
    name: 'Finn',
    level: 4,
    currentXP: 3750,
    dailyXP: 175,
    maxDailyXP: 250
  });

  const [tasks] = useState({
    dailyQuests: [
      {
        id: 1,
        name: "Morning Hero Routine",
        description: "Brush teeth, make bed, get dressed",
        xp: 30,
        timeLimit: "8:00 AM",
        category: "Personal Care",
        completed: false,
        requiresPhoto: false,
        streak: 5
      },
      {
        id: 2,
        name: "Pet Care Mission",
        description: "Feed and walk Bailey",
        xp: 25,
        category: "Pet Care",
        completed: false,
        requiresPhoto: true,
        shared: true,
        streak: 3
      }
    ],
    specialQuests: [
      {
        id: 3,
        name: "Homework Champion",
        description: "Complete today's homework",
        xp: 50,
        category: "Academics",
        completed: false,
        requiresPhoto: false,
        bonus: "Level Up Boost: +10 XP"
      }
    ],
    weeklyQuests: [
      {
        id: 4,
        name: "Room Organization Master",
        description: "Keep room clean for whole week",
        xp: 100,
        category: "Organization",
        progress: 5,
        totalDays: 7,
        requiresPhoto: true
      }
    ]
  });

  const categories = [
    { id: 'all', name: 'All Quests', icon: <Sword /> },
    { id: 'daily', name: 'Daily Quests', icon: <Clock /> },
    { id: 'special', name: 'Special Quests', icon: <Star /> },
    { id: 'weekly', name: 'Weekly Quests', icon: <Target /> }
  ];

  const handleTaskComplete = (taskId) => {
    // Implementation for task completion
    console.log('Completing task:', taskId);
  };

  const handlePhotoUpload = (taskId) => {
    // Implementation for photo upload
    console.log('Uploading photo for task:', taskId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Daily Progress */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Today's Quests</h1>
              <p className="text-lg opacity-90">Keep up the great work!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{playerStats.dailyXP}/{playerStats.maxDailyXP}</div>
              <div className="text-sm opacity-90">XP Earned Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Selection */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* Daily Quests */}
      {(selectedCategory === 'all' || selectedCategory === 'daily') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Daily Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.dailyQuests.map(task => (
                <div
                  key={task.id}
                  className="p-4 bg-white rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{task.name}</h3>
                      <p className="text-gray-600">{task.description}</p>
                      {task.streak > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-orange-500">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">{task.streak} day streak!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="w-5 h-5" />
                        {task.xp} XP
                      </div>
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Complete
                      </button>
                      {task.requiresPhoto && (
                        <button
                          onClick={() => handlePhotoUpload(task.id)}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Quests */}
      {(selectedCategory === 'all' || selectedCategory === 'special') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Special Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.specialQuests.map(task => (
                <div
                  key={task.id}
                  className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{task.name}</h3>
                      <p className="text-gray-600">{task.description}</p>
                      {task.bonus && (
                        <div className="mt-2 flex items-center gap-1 text-yellow-600">
                          <Medal className="w-4 h-4" />
                          <span className="text-sm font-medium">{task.bonus}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="w-5 h-5" />
                        {task.xp} XP
                      </div>
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        Accept Quest
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Quests */}
      {(selectedCategory === 'all' || selectedCategory === 'weekly') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Weekly Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.weeklyQuests.map(task => (
                <div
                  key={task.id}
                  className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{task.name}</h3>
                      <p className="text-gray-600">{task.description}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}/{task.totalDays} days</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${(task.progress / task.totalDays) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-green-500 font-bold">
                        <Star className="w-5 h-5" />
                        {task.xp} XP
                      </div>
                      {task.requiresPhoto && (
                        <button
                          onClick={() => handlePhotoUpload(task.id)}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskView;
