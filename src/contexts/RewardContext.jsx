// src/contexts/RewardContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RewardContext = createContext(null);

const defaultRewards = [
  // ... keep your existing default rewards ...
];

export const RewardProvider = ({ children }) => {
  const [rewards, setRewards] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const storedRewards = localStorage.getItem('quest-rewards-rewards');
    const storedClaims = localStorage.getItem('quest-rewards-claims');
    
    if (storedRewards) {
      const parsedRewards = JSON.parse(storedRewards);
      if (parsedRewards.length === 0) {
        setRewards(defaultRewards);
        localStorage.setItem('quest-rewards-rewards', JSON.stringify(defaultRewards));
      } else {
        setRewards(parsedRewards);
      }
    } else {
      setRewards(defaultRewards);
      localStorage.setItem('quest-rewards-rewards', JSON.stringify(defaultRewards));
    }

    if (storedClaims) {
      setClaims(JSON.parse(storedClaims));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('quest-rewards-rewards', JSON.stringify(rewards));
      localStorage.setItem('quest-rewards-claims', JSON.stringify(claims));
    }
  }, [rewards, claims, loading]);

  const addReward = (rewardData) => {
    const newReward = {
      ...rewardData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id,
      available: true
    };

    setRewards(prevRewards => [...prevRewards, newReward]);
    return newReward;
  };

  const updateReward = (rewardId, updates) => {
    setRewards(prevRewards =>
      prevRewards.map(reward =>
        reward.id === rewardId ? { ...reward, ...updates } : reward
      )
    );
  };

  const deleteReward = (rewardId) => {
    setRewards(prevRewards => prevRewards.filter(reward => reward.id !== rewardId));
  };

  const claimReward = (rewardId, childId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && reward.available) {
      const newClaim = {
        id: Date.now().toString(),
        rewardId,
        childId,
        claimedAt: new Date().toISOString(),
        approved: !reward.requiresApproval,
        cost: reward.xpCost
      };
      
      setClaims(prevClaims => [...prevClaims, newClaim]);
      
      if (!reward.unlimited) {
        updateReward(rewardId, { available: false });
      }
      
      return true;
    }
    return false;
  };

  const approveClaim = (claimId) => {
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim.id === claimId ? { ...claim, approved: true } : claim
      )
    );
  };

  const denyClaim = (claimId) => {
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim.id === claimId ? { ...claim, approved: false, denied: true } : claim
      )
    );
  };

  const getPendingClaims = () => {
    return claims.filter(claim => !claim.approved && !claim.denied);
  };

  const value = {
    rewards,
    claims,
    addReward,
    updateReward,
    deleteReward,
    claimReward,
    approveClaim,
    denyClaim,
    getPendingClaims,
    loading
  };

  return (
    <RewardContext.Provider value={value}>
      {!loading && children}
    </RewardContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardProvider');
  }
  return context;
};

export default RewardProvider;