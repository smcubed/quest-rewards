import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const XPContext = createContext(null);

export const XPProvider = ({ children }) => {
  const [xpHistory, setXPHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const storedHistory = localStorage.getItem('quest-rewards-xp-history');
    if (storedHistory) {
      setXPHistory(JSON.parse(storedHistory));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('quest-rewards-xp-history', JSON.stringify(xpHistory));
    }
  }, [xpHistory, loading]);

  const calculateLevel = (totalXP) => {
    const levels = [
      { level: 1, requirement: 0 },
      { level: 2, requirement: 500 },
      { level: 3, requirement: 1250 },
      { level: 4, requirement: 2500 },
      { level: 5, requirement: 4000 },
      { level: 6, requirement: 6000 }
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalXP >= levels[i].requirement) {
        return levels[i].level;
      }
    }
    return 1;
  };

  const applyXPDeduction = async (deductionData) => {
    const { childId, amount, severity, reason, redemptionQuest, redemptionDetails } = deductionData;
    
    // Get current child XP from localStorage
    const users = JSON.parse(localStorage.getItem('quest-rewards-auth') || '{}');
    const child = users.children?.find(c => c.id === childId);
    const currentChildXP = child?.currentXP || 0;
    
    // Ensure deduction won't cause negative XP
    const finalDeduction = Math.min(currentChildXP, amount);
    const newXP = currentChildXP - finalDeduction;
    
    const deduction = {
      id: Date.now().toString(),
      type: 'deduction',
      childId,
      amount: -finalDeduction,
      severity,
      reason,
      hasRedemptionQuest: redemptionQuest,
      redemptionDetails,
      appliedBy: currentUser?.id,
      appliedAt: new Date().toISOString(),
      previousXP: currentChildXP,
      newXP: newXP,
      previousLevel: calculateLevel(currentChildXP),
      newLevel: calculateLevel(newXP)
    };

    // Update XP history
    setXPHistory(prev => [...prev, deduction]);

    // Update child's XP in localStorage
    if (users.children) {
      const updatedChildren = users.children.map(c =>
        c.id === childId
          ? {
              ...c,
              currentXP: newXP,
              level: calculateLevel(newXP)
            }
          : c
      );
      users.children = updatedChildren;
      localStorage.setItem('quest-rewards-auth', JSON.stringify(users));
    }
    
    return deduction;
  };

  const getXPHistory = (childId) => {
    return xpHistory.filter(entry => entry.childId === childId);
  };

  const getRedemptionQuests = (childId) => {
    return xpHistory
      .filter(entry =>
        entry.childId === childId &&
        entry.type === 'deduction' &&
        entry.hasRedemptionQuest &&
        !entry.redemptionCompleted
      );
  };

  const value = {
    applyXPDeduction,
    getXPHistory,
    getRedemptionQuests,
    loading
  };

  return (
    <XPContext.Provider value={value}>
      {!loading && children}
    </XPContext.Provider>
  );
};

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};

export default XPProvider;
