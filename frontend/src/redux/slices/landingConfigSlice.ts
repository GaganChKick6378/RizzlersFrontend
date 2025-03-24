import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LandingConfig } from '@/interfaces/landingConfig.interface';
import { applyLandingConfigDefaults } from '@/utils/configUtils';
import axios from 'axios';

interface LandingConfigState {
  config: LandingConfig | null;
  loading: boolean;
  error: string | null;
}

const initialState: LandingConfigState = {
  config: null,
  loading: false,
  error: null
};

export const fetchLandingConfig = createAsyncThunk(
  'landingConfig/fetchConfig',
  async (tenantId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<LandingConfig>(
        `https://uydc3b10re.execute-api.ap-south-1.amazonaws.com/dev/api/tenant-configurations/tenant/${tenantId}/landing`
      );
      // Apply default values to ensure complete data structure
      return applyLandingConfigDefaults(response.data);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch landing config');
    }
  }
);

const landingConfigSlice = createSlice({
  name: 'landingConfig',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<LandingConfig>) => {
      // Apply defaults when manually setting config as well
      state.config = applyLandingConfigDefaults(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandingConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
        state.error = null;
      })
      .addCase(fetchLandingConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setConfig } = landingConfigSlice.actions;
export default landingConfigSlice.reducer;
