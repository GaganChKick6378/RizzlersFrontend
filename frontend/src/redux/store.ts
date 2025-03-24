import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import headerReducer from './slices/headerSlice';
import landingConfigReducer from './slices/landingConfigSlice';
import roomRatesReducer from './slices/roomRatesSlice';
import locationReducer from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    header: headerReducer,
    landingConfig: landingConfigReducer,
    roomRates: roomRatesReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
