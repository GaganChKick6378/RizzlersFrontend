import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Currency } from '@/interfaces/landingConfig.interface';
import { Language } from '@/enums/language.enum';
import { setLanguage } from './headerSlice';

interface ExchangeRate {
  rate: number;
  timestamp: number;
}

interface GeoLocationResponse {
  ip: string;
  continent: {
    code: string;
    name: string;
  };
  country: {
    code: string;
    name: string;
    is_eu: boolean;
    capital: string;
    phone_code: string;
    currencies: {
      code: string;
      name: string;
      symbol: string;
    }[];
  };
  city: {
    name: string;
  };
}

interface CurrencyConversionResponse {
  base_currency_code: string;
  base_currency_name: string;
  amount: string;
  updated_date: string;
  rates: {
    [key: string]: {
      currency_name: string;
      rate: string;
      rate_for_amount: string;
    };
  };
  status: string;
}

interface CurrencyState {
  selectedCurrency: Currency | null;
  exchangeRates: Record<string, ExchangeRate>;
  loading: boolean;
  error: string | null;
}

const DEFAULT_CURRENCY: Currency = {
  code: 'USD',
  name: 'US Dollar',
  symbol: '$',
  active: true
};

const initialState: CurrencyState = {
  selectedCurrency: DEFAULT_CURRENCY,
  exchangeRates: {},
  loading: false,
  error: null
};

// Helper function to get browser language
const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  // Check if the browser language is in our supported languages enum
  switch (browserLang) {
    case 'en':
      return Language.English;
    case 'es':
      return Language.Spanish;
    case 'fr':
      return Language.French;
    case 'de':
      return Language.German;
    case 'it':
      return Language.Italian;
    default:
      return Language.English; // Default to English
  }
};

// Fetch user location and determine currency
export const detectUserCurrency = createAsyncThunk(
  'currency/detectUserCurrency',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      // First get existing currencies from the landing config
      const state = getState() as { landingConfig: { config: { currencies?: { options: Currency[] }, languages?: { options: { code: string, name: string, active: boolean }[] } } } };
      const availableCurrencies = state.landingConfig.config?.currencies?.options || [];
      const availableLanguages = state.landingConfig.config?.languages?.options || [];
      
      // Detect browser language first
      const browserLanguage = getBrowserLanguage();
      
      // Find matching language in available languages (case insensitive)
      const matchedLanguage = availableLanguages.find(
        lang => lang.code.toLowerCase() === browserLanguage.toString() || 
                lang.code.toUpperCase() === browserLanguage.toString().toUpperCase()
      );
      
      if (matchedLanguage && matchedLanguage.active) {
        // Update language in header slice
        dispatch(setLanguage(browserLanguage));
      }
      
      // Get user's location
      const response = await axios.get<GeoLocationResponse>(
        'https://ip-geo-location.p.rapidapi.com/ip/check?format=json&language=en',
        {
          headers: {
            'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com',
            'x-rapidapi-key': 'd58683d8d8msh3fcc87d79b328ebp15d1dfjsnc54152dfde59'
          }
        }
      );

      // Extract currency information
      const locationData = response.data;
      console.log('Location data:', locationData);
      const countryCurrencyCode = locationData.country.currencies?.[0]?.code;
      
      // Find matching currency in available currencies
      const matchedCurrency = countryCurrencyCode 
        ? availableCurrencies.find(c => c.code === countryCurrencyCode && c.active) 
        : null;
      
      // Use matched currency or default
      const detectedCurrency = matchedCurrency || DEFAULT_CURRENCY;
      
      console.log('Detected currency:', detectedCurrency);
      
      // If detected currency is not USD, fetch exchange rate
      if (detectedCurrency.code !== 'USD') {
        dispatch(fetchExchangeRate({
          from: 'USD',
          to: detectedCurrency.code
        }));
      }
      
      return detectedCurrency;
    } catch (error) {
      console.error('Error detecting user currency:', error);
      return rejectWithValue(DEFAULT_CURRENCY);
    }
  }
);

// Fetch exchange rate between two currencies
export const fetchExchangeRate = createAsyncThunk(
  'currency/fetchExchangeRate',
  async ({ from, to }: { from: string; to: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get<CurrencyConversionResponse>(
        `https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=${from}&to=${to}&amount=1&language=en`,
        {
          headers: {
            'x-rapidapi-host': 'currency-converter5.p.rapidapi.com',
            'x-rapidapi-key': 'd58683d8d8msh3fcc87d79b328ebp15d1dfjsnc54152dfde59'
          }
        }
      );
      
      const data = response.data;
      const rate = parseFloat(data.rates[to].rate);
      
      console.log(`Exchange rate from ${from} to ${to}:`, rate);
      
      return {
        fromCurrency: from,
        toCurrency: to,
        rate,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return rejectWithValue('Failed to fetch exchange rate');
    }
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle detectUserCurrency actions
      .addCase(detectUserCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectUserCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCurrency = action.payload;
      })
      .addCase(detectUserCurrency.rejected, (state) => {
        state.loading = false;
        state.selectedCurrency = DEFAULT_CURRENCY;
        state.error = 'Failed to detect currency. Using USD as default.';
      })
      
      // Handle fetchExchangeRate actions
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        const { fromCurrency, toCurrency, rate, timestamp } = action.payload;
        const key = `${fromCurrency}_${toCurrency}`;
        
        state.exchangeRates[key] = {
          rate,
          timestamp
        };
      });
  }
});

export const { setSelectedCurrency } = currencySlice.actions;

// Selector to convert price from USD to selected currency
export const convertPrice = (price: number, state: { currency: CurrencyState }) => {
  const { selectedCurrency, exchangeRates } = state.currency;
  
  if (!selectedCurrency || selectedCurrency.code === 'USD') {
    return price;
  }
  
  const rateKey = `USD_${selectedCurrency.code}`;
  const exchangeRate = exchangeRates[rateKey];
  
  if (!exchangeRate) {
    return price; // Return original price if exchange rate not available
  }
  
  // Check if exchange rate is older than 24 hours (86400000 ms)
  const isRateExpired = Date.now() - exchangeRate.timestamp > 86400000;
  
  if (isRateExpired) {
    // Rate is expired, but use it anyway until a fresh rate is fetched
    console.warn('Using expired exchange rate');
  }
  
  return price * exchangeRate.rate;
};

export default currencySlice.reducer; 