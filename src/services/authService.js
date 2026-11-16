import api from './api';
import { MOCK_USER } from './mockData';

// NOTE: All mock functions return simulated responses.
// Replace with real API calls when the backend is ready.

export const authService = {
  login: async ({ email, password }) => {
    try {
      const res = await api.post('/api/user/auth/login', { email, password });
      return res.data;
    } catch {
      // Mock fallback
      if (email === 'demo@homequest.com' && password === 'demo123') {
        return { success: true, token: 'mock_user_token_123', user: MOCK_USER };
      }
      throw new Error('Invalid email or password');
    }
  },

  register: async ({ name, email, phone, password }) => {
    try {
      const res = await api.post('/api/user/auth/register', { name, email, phone, password });
      return res.data;
    } catch {
      // Mock fallback
      return {
        success: true,
        message: 'OTP sent to your phone number',
        otpSent: true,
        phone,
      };
    }
  },

  verifyOtp: async ({ phone, otp }) => {
    try {
      const res = await api.post('/api/user/auth/verify-otp', { phone, otp });
      return res.data;
    } catch {
      // Mock: accept any 4-digit OTP
      if (otp && otp.length === 4) {
        return { success: true, token: 'mock_user_token_123', user: MOCK_USER };
      }
      throw new Error('Invalid OTP');
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const res = await api.post('/api/user/auth/forgot-password', { email });
      return res.data;
    } catch {
      return { success: true, message: 'Password reset link sent to your email' };
    }
  },

  logout: async () => {
    try {
      await api.post('/api/user/auth/logout');
    } catch { /* ignore */ }
  },

  getProfile: async () => {
    try {
      const res = await api.get('/api/user/profile');
      return res.data;
    } catch {
      return { success: true, user: MOCK_USER };
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put('/api/user/profile', data);
      return res.data;
    } catch {
      return { success: true, user: { ...MOCK_USER, ...data } };
    }
  },
};
