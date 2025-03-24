import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LocationState } from "@/interfaces/location.interface";

// Thunk to detect user's location based on IP
export const detectUserLocation = createAsyncThunk(
  "location/detectUserLocation",
  async (_, { rejectWithValue }) => {
    try {
      // Get the IP address first and wait for the response
      const ipResponse = await axios.get('https://freeipapi.com/ip');
      const ipAddress = ipResponse.data; // Extract the actual IP string from response
      
      // For better reliability, use a single API call with complete location data
      const locationResponse = await axios.get(`https://freeipapi.com/api/json/${ipAddress}`);
      
      // Extract the relevant fields
      const { country_name: countryName, currency } = locationResponse.data;
      const currencyCode = currency ? currency.code : '';
      
      console.log(`Detected location: ${countryName} with currency: ${currencyCode}`);
      
      return {
        countryName,
        currency: currencyCode,
        ipAddress: ipAddress
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to detect user location");
    }
  }
);

const initialState: LocationState = {
  loading: false,
  error: null,
  country: "",
  currency: "",
  ip: "",
  detected: false
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    resetLocationState: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectUserLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectUserLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.country = action.payload.countryName;
        state.currency = action.payload.currency;
        state.ip = action.payload.ipAddress;
        state.detected = true;
      })
      .addCase(detectUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetLocationState } = locationSlice.actions;
export default locationSlice.reducer; 