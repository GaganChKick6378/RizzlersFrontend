import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
