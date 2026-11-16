import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async (key) => {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch { return false; }
  },
  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch { return false; }
  },
  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch { return false; }
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'user_auth_token',
  USER_DATA: 'user_data',
  WISHLIST: 'user_wishlist',
  SEARCH_HISTORY: 'search_history',
  ONBOARDING_DONE: 'onboarding_done',
};
