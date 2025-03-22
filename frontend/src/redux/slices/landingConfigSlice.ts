import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LandingConfig } from '@/interfaces/landingConfig.interface';
import { landingConfigData } from '@/data/landingConfig';

interface LandingConfigState {
  config: LandingConfig | null;
}

const initialState: LandingConfigState = {
  config: landingConfigData[1] // Initially load tenant 1's config
};

const landingConfigSlice = createSlice({
  name: 'landingConfig',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<LandingConfig>) => {
      state.config = action.payload;
    }
  }
});

export const { setConfig } = landingConfigSlice.actions;
export default landingConfigSlice.reducer;
