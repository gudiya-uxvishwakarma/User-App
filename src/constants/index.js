export { COLORS, default as COLORS_DEFAULT } from './colors';
export { FONTS, FONT_SIZES, LINE_HEIGHTS } from './typography';
export { SPACING, RADIUS, SHADOW } from './spacing';

export const APP_NAME = 'HomeQuest';
export const API_TIMEOUT = 15000;

export const BHK_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Studio', 'Villa', 'Penthouse'];

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Studio', 'Penthouse'];

export const AMENITIES_LIST = [
  'Lift', 'Parking', 'Power Backup', 'Water Supply', 'Security',
  'CCTV', 'Swimming Pool', 'Gym', 'Garden', 'Clubhouse',
  "Children's Play Area", 'Jogging Track', 'Community Hall',
  'Sports Area', 'Wi-Fi', 'Intercom', 'Fire Safety',
];

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  RESCHEDULED: 'rescheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const SORT_OPTIONS = [
  { label: 'Latest First', value: 'latest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM',
];
