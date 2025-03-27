import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import { combineReducers } from '@reduxjs/toolkit';

import headerReducer from './slices/headerSlice';
import landingConfigReducer from './slices/landingConfigSlice';
import roomRatesReducer from './slices/roomRatesSlice';
import locationReducer from './slices/locationSlice';
import roomReducer from './slices/roomSlice';

// Setup Redux persist configuration
const persistConfig = {
  key: 'rizzlers-state',
  storage,
  whitelist: [ 'header', 'location', 'landingConfig'],
};

// Combine the reducers
const rootReducer = combineReducers({
  header: headerReducer,
  landingConfig: landingConfigReducer,
  roomRates: roomRatesReducer,
  location: locationReducer,
  room: roomReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
