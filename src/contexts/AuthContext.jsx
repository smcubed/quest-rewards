import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('currentUser');
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, pin) => {
    try {
      let users = JSON.parse(localStorage.getItem('quest-rewards-auth'));
      if (!users) {
        users = {
          parents: [
            {
              id: 'parent1',
              name: 'Mom',
              type: 'parent',
              username: 'mom',
              pin: '080410'
            },
            {
              id: 'parent2',
              name: 'Dad',
              type: 'parent',
              username: 'dad',
              pin: '080410'
            }
          ],
          children: [
            {
              id: 'child1',
              name: 'Finn',
              birthDate: '2013-10-08',
              age: 11,
              type: 'child',
              level: 1,
              currentXP: 0,
              goldCoins: 0,
              username: 'finn',
              pin: '5689'
            },
            {
              id: 'child2',
              name: 'Rion',
              birthDate: '2016-05-29',
              age: 8,
              type: 'child',
              level: 1,
              currentXP: 0,
              goldCoins: 0,
              username: 'rion',
              pin: '5689'
            }
          ]
        };
        localStorage.setItem('quest-rewards-auth', JSON.stringify(users));
      } else {
        // Ensure existing children have goldCoins property
        if (users.children) {
          users.children = users.children.map(child => ({
            ...child,
            goldCoins: child.goldCoins || 0
          }));
          localStorage.setItem('quest-rewards-auth', JSON.stringify(users));
        }
      }

      const parent = users.parents.find(
        p => p.username === username && p.pin === pin
      );
      
      if (parent) {
        setCurrentUser(parent);
        sessionStorage.setItem('currentUser', JSON.stringify(parent));
        navigate('/parent');
        return true;
      }

      const child = users.children.find(
        c => c.username === username && c.pin === pin
      );
      
      if (child) {
        setCurrentUser(child);
        sessionStorage.setItem('currentUser', JSON.stringify(child));
        navigate('/kids');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  const isParent = () => currentUser?.type === 'parent';
  const isChild = () => currentUser?.type === 'child';

  const value = {
    currentUser,
    login,
    logout,
    isParent,
    isChild,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;