export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address';
  if (!password?.trim()) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

export const validateRegister = ({ name, email, phone, password, confirmPassword }) => {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address';
  if (!phone?.trim()) errors.phone = 'Phone number is required';
  else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit Indian phone number';
  if (!password?.trim()) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateBooking = ({ name, phone, visitDate, timeSlot, visitors }) => {
  const errors = {};
  if (!name?.trim()) errors.name = 'Your name is required';
  if (!phone?.trim()) errors.phone = 'Phone number is required';
  else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit phone number';
  if (!visitDate) errors.visitDate = 'Please select a visit date';
  if (!timeSlot) errors.timeSlot = 'Please select a time slot';
  if (!visitors || visitors < 1) errors.visitors = 'At least 1 visitor required';
  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
