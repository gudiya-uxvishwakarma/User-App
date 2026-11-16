import axios from 'axios';
import { storage, STORAGE_KEYS } from '../utils/storage';

// ─── API Configuration ───────────────────────────────────────────────────────
// Change MODE to 'device' and set DEVICE_URL to your machine's local IP
// when testing on a physical device.
const MODE = 'emulator'; // 'emulator' | 'device'
const EMULATOR_URL = 'http://10.0.2.2:5000';
const DEVICE_URL = 'http://192.168.1.1:5000'; // Replace with your PC's IP

export const API_BASE_URL = MODE === 'device' ? DEVICE_URL : EMULATOR_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await storage.get(STORAGE_KEYS.AUTH_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  },
);

export default api;
