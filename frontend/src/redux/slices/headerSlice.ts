import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { HeaderState } from "@/interfaces/header.interface";
import { Language } from "@/enums/language.enum";
import { getCurrencyByLocale } from "@/lib/currencyUtils";
import axios from "axios";

// Thunk to fetch currency conversion rate
export const fetchCurrencyRate = createAsyncThunk(
    "header/fetchCurrencyRate",
    async ({ from, to }: { from: string, to: string }, { rejectWithValue }) => {
        try {
            // If the "to" currency is the same as the "from" currency, the rate is 1
            if (from === to) {
                return {
                    code: to,
                    rate: 1
                };
            }
            
            const response = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
            return {
                code: to,
                rate: response.data.rates[to]
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to fetch currency rate");
        }
    }
);

// Get initial currency with a temporary multiplier (will be updated by API)
const getInitialCurrency = () => {
    const currency = getCurrencyByLocale(navigator.language);
    return {
        ...currency,
        multiplier: null // Temporary value, will be set by API call
    };
};

const initialState: HeaderState = {
    language: Language.English,
    currency: getInitialCurrency()
};

const headerSlice = createSlice({
    name: "headerSlice",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            const language = action.payload;
            state.language = language;
            // Update currency when language changes, but keep the multiplier
            const newCurrency = getCurrencyByLocale(language.toLowerCase());
            state.currency = {
                ...newCurrency,
                multiplier: state.currency.multiplier
            };
        },
        setCurrency: (state, action: PayloadAction<{ code: string; symbol: string; multiplier?: number }>) => {
            state.currency = {
                code: action.payload.code,
                symbol: action.payload.symbol,
                multiplier: action.payload.multiplier !== undefined ? action.payload.multiplier : state.currency.multiplier
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrencyRate.fulfilled, (state, action) => {
                if (state.currency.code === action.payload.code) {
                    state.currency.multiplier = action.payload.rate;
                }
            });
    }
});

export const { setLanguage, setCurrency } = headerSlice.actions;
export default headerSlice.reducer;