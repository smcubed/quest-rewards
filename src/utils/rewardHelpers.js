import { isAfter, parseISO } from 'date-fns';

export const calculateCashOutValue = (xp, tier) => {
  const rates = {
    standard: { amount: 10, xpCost: 1500 },
    elite: { amount: 25, xpCost: 7500 },
    epic: { amount: 50, xpCost: 20000 },
    legendary: { amount: 100, xpCost: 40000 }
  };

  return rates[tier] || rates.standard;
};

export const getAvailableRewards = (rewards, userLevel, currentXP) => {
  return rewards.filter(reward => {
    const isLevelUnlocked = userLevel >= reward.minLevel;
    const canAfford = currentXP >= reward.xpCost;
    const isAvailable = reward.available;
    const isNotExpired = !reward.expiresAt || isAfter(parseISO(reward.expiresAt), new Date());
    
    return isLevelUnlocked && canAfford && isAvailable && isNotExpired;
  });
};

export const getRewardsByTier = (rewards, tier) => {
  if (tier === 'all') return rewards;
  return rewards.filter(reward => reward.tier === tier);
};

export const calculateBankingBonus = (amount, fromTier, toTier) => {
  const bonusRates = {
    standard: { monthly: 0.75, quarterly: 0.70, yearly: 0.65 },
    elite: { quarterly: 0.80, yearly: 0.75 },
    epic: { yearly: 0.85 }
  };

  const rate = bonusRates[fromTier]?.[toTier] || 0;
  return Math.round(amount * rate);
};

export const getLimitedTimeRewards = (rewards) => {
  return rewards.filter(reward =>
    reward.timeLimit &&
    isAfter(parseISO(reward.expiresAt), new Date())
  ).sort((a, b) => parseISO(a.expiresAt) - parseISO(b.expiresAt));
};

export const calculateRewardProgress = (currentXP, reward) => {
  return Math.min(Math.round((currentXP / reward.xpCost) * 100), 100);
};

export const getPendingClaims = (claims) => {
  return claims.filter(claim => !claim.approved);
};

export default {
  calculateCashOutValue,
  getAvailableRewards,
  getRewardsByTier,
  calculateBankingBonus,
  getLimitedTimeRewards,
  calculateRewardProgress,
  getPendingClaims
};
