import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DailyRate, RoomRatesState } from '@/interfaces/roomRates.interface';

const initialState: RoomRatesState = {
  rates: [],
  loading: false,
  error: null,
  selectedDateRange: null,
  selectedPropertyId: null
};

export const fetchDailyRates = createAsyncThunk(
  'roomRates/fetchDailyRates',
  async ({ tenantId, propertyId }: { tenantId: number; propertyId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get<DailyRate[]>(
        `${import.meta.env.VITE_API_URL}/api/room-rates/daily-rates?tenantId=${tenantId}&propertyId=${propertyId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch daily rates');
    }
  }
);

const roomRatesSlice = createSlice({
  name: 'roomRates',
  initialState,
  reducers: {
    setSelectedDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },
    clearSelectedDateRange: (state) => {
      state.selectedDateRange = null;
    },
    setSelectedPropertyId: (state, action) => {
      state.selectedPropertyId = action.payload;
      
      // Clear selected date range when property changes
      state.selectedDateRange = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchDailyRates.rejected, (state, action) => {
        state.loading = false;
        state.rates = [];
        state.error = action.payload as string;
      });
  }
});

export const { setSelectedDateRange, clearSelectedDateRange, setSelectedPropertyId } = roomRatesSlice.actions;
export default roomRatesSlice.reducer;
