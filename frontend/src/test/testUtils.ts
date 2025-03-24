import { configureStore } from '@reduxjs/toolkit';

export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      landingConfig: (state = { loading: false, error: null, config: null }) => state,
      header: (state = { currency: { code: 'USD', symbol: '$' }, language: 'en' }) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    preloadedState: initialState
  });
};

export const defaultMessages = {
  text: 'Internet Booking Engine',
  language: 'English',
  noBooking: 'No booking'
};
