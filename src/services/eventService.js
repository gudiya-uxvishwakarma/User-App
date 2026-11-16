import api from './api';
import { MOCK_EVENTS } from './mockData';
import { generateId } from '../utils/helpers';

let _registeredEvents = [];

export const eventService = {
  getAll: async () => {
    try {
      const res = await api.get('/api/events');
      return res.data;
    } catch {
      return { success: true, data: MOCK_EVENTS };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/api/events/${id}`);
      return res.data;
    } catch {
      const found = MOCK_EVENTS.find(e => e.id === id);
      return { success: true, data: found };
    }
  },

  register: async (eventId, userData) => {
    try {
      const res = await api.post(`/api/events/${eventId}/register`, userData);
      return res.data;
    } catch {
      _registeredEvents = [..._registeredEvents, { eventId, ...userData, id: generateId() }];
      return { success: true, message: 'Successfully registered for the event' };
    }
  },

  getMyEvents: async () => {
    try {
      const res = await api.get('/api/user/events');
      return res.data;
    } catch {
      const ids = _registeredEvents.map(r => r.eventId);
      return { success: true, data: MOCK_EVENTS.filter(e => ids.includes(e.id)) };
    }
  },
};
