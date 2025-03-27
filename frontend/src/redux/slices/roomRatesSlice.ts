import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DailyRate, RoomRatesState } from '@/interfaces/roomRates.interface';
import { DateRange } from "react-day-picker";

// Define a serializable version of DateRange
interface SerializableDateRange {
  from: string | null;
  to: string | null;
}

// Helper function to convert Date objects to ISO strings
const serializeDateRange = (dateRange: DateRange | null): SerializableDateRange | null => {
  if (!dateRange) return null;
  return {
    from: dateRange.from ? dateRange.from.toISOString() : null,
    to: dateRange.to ? dateRange.to.toISOString() : null
  };
};

// Helper function to convert ISO strings back to Date objects
export const deserializeDateRange = (dateRange: SerializableDateRange | null): DateRange | null => {
  if (!dateRange) return null;
  return {
    from: dateRange.from ? new Date(dateRange.from) : undefined,
    to: dateRange.to ? new Date(dateRange.to) : undefined
  };
};

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
      // Convert Date objects to ISO strings when storing in Redux
      state.selectedDateRange = serializeDateRange(action.payload);
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
