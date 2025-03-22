import { configureStore } from '@reduxjs/toolkit';
import headerReducer from './slices/headerSlice';
import landingConfigReducer from './slices/landingConfigSlice';

export const store = configureStore({
  reducer: {
    header: headerReducer,
    landingConfig: landingConfigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
