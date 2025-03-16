import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import headerReducer from './slices/headerSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    header: headerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
