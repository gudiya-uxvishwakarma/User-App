import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { apartmentService } from '../services/apartmentService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    city: '',
    locality: '',
    bhk: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    sortBy: 'latest',
  });

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedToken = await storage.get(STORAGE_KEYS.AUTH_TOKEN);
      const savedUser = await storage.get(STORAGE_KEYS.USER_DATA);
      const savedWishlist = await storage.get(STORAGE_KEYS.WISHLIST);
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(savedUser);
      if (savedWishlist) setWishlist(savedWishlist);
    } catch (e) {
      console.warn('Session restore error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken, userData) => {
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, newToken);
    await storage.set(STORAGE_KEYS.USER_DATA, userData);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    await storage.remove(STORAGE_KEYS.USER_DATA);
    setToken(null);
    setUser(null);
  };

  const toggleWishlist = useCallback(async (apartment) => {
    const isInWishlist = wishlist.some(a => a.id === apartment.id);
    let updated;
    if (isInWishlist) {
      updated = wishlist.filter(a => a.id !== apartment.id);
    } else {
      updated = [...wishlist, apartment];
    }
    setWishlist(updated);
    await storage.set(STORAGE_KEYS.WISHLIST, updated);
    return !isInWishlist;
  }, [wishlist]);

  const isInWishlist = useCallback((id) => {
    return wishlist.some(a => a.id === id);
  }, [wishlist]);

  const updateFilters = useCallback((newFilters) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchFilters({
      search: '',
      city: '',
      locality: '',
      bhk: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      sortBy: 'latest',
    });
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      token,
      isLoggedIn: !!token,
      isLoading,
      wishlist,
      notifications,
      setNotifications,
      searchFilters,
      unreadNotificationsCount,
      login,
      logout,
      toggleWishlist,
      isInWishlist,
      updateFilters,
      clearFilters,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

export default AppContext;
