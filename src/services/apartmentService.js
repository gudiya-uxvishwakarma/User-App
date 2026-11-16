import api from './api';
import { MOCK_APARTMENTS } from './mockData';

export const apartmentService = {
  getAll: async (filters = {}) => {
    try {
      const res = await api.get('/api/apartments', { params: filters });
      return res.data;
    } catch {
      // Mock fallback — filter by query if present
      let results = [...MOCK_APARTMENTS];
      if (filters.city) results = results.filter(a => a.address.city.toLowerCase().includes(filters.city.toLowerCase()));
      if (filters.bhk) results = results.filter(a => a.bhkOptions.includes(filters.bhk));
      if (filters.listingType) results = results.filter(a => a.listingType.includes(filters.listingType));
      if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(a =>
          a.name.toLowerCase().includes(q) ||
          a.builderName.toLowerCase().includes(q) ||
          a.address.city.toLowerCase().includes(q) ||
          a.address.locality.toLowerCase().includes(q),
        );
      }
      return { success: true, data: results, total: results.length };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/api/apartments/${id}`);
      return res.data;
    } catch {
      const found = MOCK_APARTMENTS.find(a => a.id === id);
      if (found) return { success: true, data: found };
      throw new Error('Apartment not found');
    }
  },

  getFeatured: async () => {
    try {
      const res = await api.get('/api/apartments/featured');
      return res.data;
    } catch {
      return { success: true, data: MOCK_APARTMENTS.filter(a => a.isFeatured) };
    }
  },

  getPopular: async () => {
    try {
      const res = await api.get('/api/apartments/popular');
      return res.data;
    } catch {
      return { success: true, data: MOCK_APARTMENTS.filter(a => a.isPopular) };
    }
  },

  getRecent: async () => {
    try {
      const res = await api.get('/api/apartments/recent');
      return res.data;
    } catch {
      const sorted = [...MOCK_APARTMENTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { success: true, data: sorted.slice(0, 6) };
    }
  },

  getNearby: async ({ latitude, longitude }) => {
    try {
      const res = await api.get('/api/apartments/nearby', { params: { latitude, longitude } });
      return res.data;
    } catch {
      return { success: true, data: MOCK_APARTMENTS.slice(0, 4) };
    }
  },

  getRentListings: async (filters = {}) => {
    try {
      const res = await api.get('/api/apartments', { params: { ...filters, listingType: 'rent' } });
      return res.data;
    } catch {
      return { success: true, data: MOCK_APARTMENTS.filter(a => a.listingType.includes('rent')) };
    }
  },

  getSaleListings: async (filters = {}) => {
    try {
      const res = await api.get('/api/apartments', { params: { ...filters, listingType: 'sale' } });
      return res.data;
    } catch {
      return { success: true, data: MOCK_APARTMENTS.filter(a => a.listingType.includes('sale')) };
    }
  },
};
