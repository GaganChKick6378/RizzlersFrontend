import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DailyRate, RoomRatesState } from '@/interfaces/roomRates.interface';

const initialState: RoomRatesState = {
  rates: [],
  loading: false,
  error: null
};

export const fetchDailyRates = createAsyncThunk(
  'roomRates/fetchDailyRates',
  async ({ tenantId, propertyId }: { tenantId: number; propertyId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get<DailyRate[]>(
        `https://uydc3b10re.execute-api.ap-south-1.amazonaws.com/dev/api/room-rates/daily-rates?tenantId=${tenantId}&propertyId=${propertyId}`
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
        state.error = null;
      })
      .addCase(fetchDailyRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default roomRatesSlice.reducer;
