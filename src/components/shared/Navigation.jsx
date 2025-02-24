import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Settings, Home, Star, Gift } from 'lucide-react';

const NavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

const MobileNavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-blue-600"
  >
    {icon}
    <span className="text-xs">{children}</span>
  </Link>
);

const Navigation = () => {
  const { currentUser, logout, isParent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home */}
          <div className="flex items-center">
            <Link
              to={isParent() ? "/parent" : "/kids"}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Star className="h-6 w-6" />
              <span className="font-bold text-lg">
                {isParent() ? 'Quest & Rewards' : 'Adventure Quest'}
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isParent() ? (
              <>
                <NavLink to="/parent" icon={<Home />}>Dashboard</NavLink>
                <NavLink to="/parent/tasks" icon={<Star />}>Tasks</NavLink>
                <NavLink to="/parent/rewards" icon={<Gift />}>Rewards</NavLink>
                <NavLink to="/parent/settings" icon={<Settings />}>Settings</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/kids" icon={<Home />}>My Quests</NavLink>
                <NavLink to="/kids/rewards" icon={<Gift />}>Reward Shop</NavLink>
                <NavLink to="/kids/achievements" icon={<Star />}>Achievements</NavLink>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-700">{currentUser?.name}</div>
                <div className="text-gray-500 text-xs">
                  {isParent() ? 'Parent' : `Level ${currentUser?.level}`}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          {isParent() ? (
            <>
              <MobileNavLink to="/parent" icon={<Home />}>Home</MobileNavLink>
              <MobileNavLink to="/parent/tasks" icon={<Star />}>Tasks</MobileNavLink>
              <MobileNavLink to="/parent/rewards" icon={<Gift />}>Rewards</MobileNavLink>
              <MobileNavLink to="/parent/settings" icon={<Settings />}>Settings</MobileNavLink>
            </>
          ) : (
            <>
              <MobileNavLink to="/kids" icon={<Home />}>Quests</MobileNavLink>
              <MobileNavLink to="/kids/rewards" icon={<Gift />}>Shop</MobileNavLink>
              <MobileNavLink to="/kids/achievements" icon={<Star />}>Awards</MobileNavLink>
              <MobileNavLink to="/kids/profile" icon={<User />}>Profile</MobileNavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
