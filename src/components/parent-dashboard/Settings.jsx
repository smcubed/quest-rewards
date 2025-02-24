import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Settings,
  User,
  Bell,
  Shield,
  Calendar,
  Clock,
  Star,
  ArrowUpCircle
} from 'lucide-react';

const ParentSettings = () => {
  const [activeSection, setActiveSection] = useState('general');

  // Example settings data
  const [settings, setSettings] = useState({
    general: {
      allowWeekendTasks: true,
      requirePhotoVerification: false,
      autoApproveBasicTasks: true,
      dailyXPCap: 250
    },
    notifications: {
      taskCompletion: true,
      rewardClaims: true,
      levelUps: true,
      streakAlerts: true,
      emailNotifications: false
    },
    ageProgression: {
      finn: {
        age: 11,
        birthDate: '2013-10-08',
        nextAgeAdjustment: '2025-10-08',
        currentXpMultiplier: 1.0
      },
      rion: {
        age: 8,
        birthDate: '2016-05-29',
        nextAgeAdjustment: '2025-05-29',
        currentXpMultiplier: 1.2
      }
    },
    security: {
      requirePinForRewards: true,
      requirePinForSettings: true,
      allowChildrenToSeeProgress: true
    }
  });

  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Settings Navigation */}
      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveSection('general')}
          className={`px-4 py-2 ${
            activeSection === 'general'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </div>
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`px-4 py-2 ${
            activeSection === 'notifications'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </div>
        </button>
        <button
          onClick={() => setActiveSection('ageProgression')}
          className={`px-4 py-2 ${
            activeSection === 'ageProgression'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4" />
            Age Progression
          </div>
        </button>
        <button
          onClick={() => setActiveSection('security')}
          className={`px-4 py-2 ${
            activeSection === 'security'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </div>
        </button>
      </div>

      {/* General Settings */}
      {activeSection === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div>
                <h3 className="font-medium">Weekend Tasks</h3>
                <p className="text-sm text-gray-600">Allow tasks to be completed on weekends</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.general.allowWeekendTasks}
                  onChange={(e) => handleSettingChange('general', 'allowWeekendTasks', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <h3 className="font-medium">Photo Verification</h3>
                <p className="text-sm text-gray-600">Require photo proof for task completion</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.general.requirePhotoVerification}
                  onChange={(e) => handleSettingChange('general', 'requirePhotoVerification', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <h3 className="font-medium">Daily XP Cap</h3>
                <p className="text-sm text-gray-600">Maximum XP that can be earned per day</p>
              </div>
              <input
                type="number"
                value={settings.general.dailyXPCap}
                onChange={(e) => handleSettingChange('general', 'dailyXPCap', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Settings */}
      {activeSection === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2">
                <div>
                  <h3 className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Age Progression Settings */}
      {activeSection === 'ageProgression' && (
        <Card>
          <CardHeader>
            <CardTitle>Age Progression Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(settings.ageProgression).map(([child, data]) => (
                <div key={child} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-4 text-lg capitalize">{child}'s Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Age</label>
                      <p className="mt-1">{data.age} years old</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                      <p className="mt-1">{data.birthDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Next Age Adjustment</label>
                      <p className="mt-1">{data.nextAgeAdjustment}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">XP Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={data.currentXpMultiplier}
                        onChange={(e) => handleSettingChange('ageProgression', `${child}.currentXpMultiplier`, parseFloat(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      {activeSection === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.security).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2">
                <div>
                  <h3 className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingChange('security', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParentSettings;
