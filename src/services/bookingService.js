import api from './api';
import { MOCK_BOOKINGS } from './mockData';
import { generateId } from '../utils/helpers';

let _localBookings = [...MOCK_BOOKINGS];

export const bookingService = {
  create: async (bookingData) => {
    try {
      const res = await api.post('/api/user/bookings', bookingData);
      return res.data;
    } catch {
      // Mock: create locally
      const newBooking = {
        id: generateId(),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        partnerRemarks: null,
      };
      _localBookings = [newBooking, ..._localBookings];
      return { success: true, data: newBooking, message: 'Visit booking submitted successfully' };
    }
  },

  getMyBookings: async () => {
    try {
      const res = await api.get('/api/user/bookings');
      return res.data;
    } catch {
      return { success: true, data: _localBookings };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/api/user/bookings/${id}`);
      return res.data;
    } catch {
      const found = _localBookings.find(b => b.id === id);
      return { success: true, data: found };
    }
  },

  cancel: async (id, reason) => {
    try {
      const res = await api.put(`/api/user/bookings/${id}/cancel`, { reason });
      return res.data;
    } catch {
      _localBookings = _localBookings.map(b =>
        b.id === id ? { ...b, status: 'cancelled', cancelReason: reason } : b,
      );
      return { success: true, message: 'Booking cancelled successfully' };
    }
  },

  requestReschedule: async (id, { newDate, newTimeSlot }) => {
    try {
      const res = await api.put(`/api/user/bookings/${id}/reschedule`, { newDate, newTimeSlot });
      return res.data;
    } catch {
      _localBookings = _localBookings.map(b =>
        b.id === id ? { ...b, status: 'rescheduled', visitDate: newDate, timeSlot: newTimeSlot } : b,
      );
      return { success: true, message: 'Reschedule request submitted' };
    }
  },
};
