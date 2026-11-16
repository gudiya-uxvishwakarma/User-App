import { Platform } from 'react-native';

/** Format price to readable string */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return 'Price on Request';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price}`;
};

/** Format rent per month */
export const formatRent = (price) => {
  if (!price) return 'On Request';
  return `₹${Number(price).toLocaleString('en-IN')}/mo`;
};

/** Format date to readable string */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Format time */
export const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

/** Validate email */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/** Validate phone */
export const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
};

/** Capitalize first letter */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/** Truncate text */
export const truncate = (str, maxLen = 60) => {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen)}...` : str;
};

/** Get status color */
export const getStatusColor = (status) => {
  const map = {
    pending: '#F59E0B',
    confirmed: '#10B981',
    rejected: '#EF4444',
    rescheduled: '#8B5CF6',
    cancelled: '#6B7280',
    completed: '#0A2463',
  };
  return map[status?.toLowerCase()] || '#6B7280';
};

/** Get image source with fallback */
export const getImageSource = (uri) => {
  if (uri && typeof uri === 'string' && uri.startsWith('http')) return { uri };
  return { uri: 'https://via.placeholder.com/400x300?text=No+Image' };
};

/** Platform specific shadow */
export const platformShadow = (color = '#0A2463', elevation = 6) => ({
  ...Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    android: { elevation },
  }),
});

/** Deep clone object */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/** Generate ID */
export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
