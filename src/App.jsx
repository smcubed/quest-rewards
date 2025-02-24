import React, { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { RewardProvider } from './contexts/RewardContext';
import { XPProvider } from './contexts/XPContext';  // Add this import
import { NotificationProvider } from './components/shared/NotificationSystem';

// Parent Dashboard Components
import ParentDashboard from './components/parent-dashboard/Dashboard';
import TaskManagement from './components/parent-dashboard/TaskManagement';
import RewardManagement from './components/parent-dashboard/RewardManagement';
import Settings from './components/parent-dashboard/Settings';

// Kids Dashboard Components
import KidsDashboard from './components/kids-dashboard/Dashboard';
import TaskView from './components/kids-dashboard/TaskView';
import RewardShop from './components/kids-dashboard/RewardShop';
import AchievementSystem from './components/kids-dashboard/AchievementSystem';

// Shared Components
import Navigation from './components/shared/Navigation';
import LoginPage from './components/shared/LoginPage';
import TestComponent from './components/TestComponent';

// Protected Route Component
const ProtectedRoute = ({ children, allowedUserType }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate('/login');
      } else if (allowedUserType && currentUser.type !== allowedUserType) {
        // Redirect parents to parent dashboard and children to kids dashboard
        navigate(currentUser.type === 'parent' ? '/parent' : '/kids');
      }
    }
  }, [currentUser, loading, allowedUserType, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return null; // useEffect will handle redirect
  }

  if (allowedUserType && currentUser.type !== allowedUserType) {
    return null; // useEffect will handle redirect
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <XPProvider>  {/* Add XPProvider here */}
            <TaskProvider>
              <RewardProvider>
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/test" element={<TestComponent />} />
                    
                    {/* Parent Routes */}
                    <Route path="/parent/*" element={
                      <ProtectedRoute allowedUserType="parent">
                        <>
                          <Navigation />
                          <Routes>
                            <Route path="/" element={<ParentDashboard />} />
                            <Route path="tasks" element={<TaskManagement />} />
                            <Route path="rewards" element={<RewardManagement />} />
                            <Route path="settings" element={<Settings />} />
                          </Routes>
                        </>
                      </ProtectedRoute>
                    } />

                    {/* Kids Routes */}
                    <Route path="/kids/*" element={
                      <ProtectedRoute allowedUserType="child">
                        <>
                          <Navigation />
                          <Routes>
                            <Route path="/" element={<KidsDashboard />} />
                            <Route path="tasks" element={<TaskView />} />
                            <Route path="rewards" element={<RewardShop />} />
                            <Route path="achievements" element={<AchievementSystem />} />
                          </Routes>
                        </>
                      </ProtectedRoute>
                    } />

                    {/* Default Routes */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </div>
              </RewardProvider>
            </TaskProvider>
          </XPProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App;
