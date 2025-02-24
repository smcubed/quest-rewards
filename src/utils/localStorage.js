const STORAGE_KEYS = {
  AUTH: 'quest-rewards-auth',
  TASKS: 'quest-rewards-tasks',
  REWARDS: 'quest-rewards-rewards',
  CLAIMS: 'quest-rewards-claims',
  SETTINGS: 'quest-rewards-settings'
};

export const getData = (key) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

export const setData = (key, value) => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

export const removeData = (key) => {
  try {
    localStorage.removeItem(STORAGE_KEYS[key]);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

export const initializeStorage = () => {
  const initialData = {
    AUTH: {
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
          username: 'rion',
          pin: '5689'
        }
      ]
    },
    TASKS: [],
    REWARDS: [],
    CLAIMS: [],
    SETTINGS: {
      general: {
        allowWeekendTasks: true,
        requirePhotoVerification: false,
        autoApproveBasicTasks: true,
        dailyXPCap: 250
      }
    }
  };

  Object.entries(initialData).forEach(([key, value]) => {
    if (!getData(key)) {
      setData(key, value);
    }
  });
};

export default {
  getData,
  setData,
  removeData,
  clearAllData,
  initializeStorage
};
