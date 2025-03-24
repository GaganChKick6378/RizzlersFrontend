import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HeaderState } from "@/interfaces/header.interface";
import { Language } from "@/enums/language.enum";
import { getCurrencyByLocale } from "@/lib/currencyUtils";

const initialState: HeaderState = {
    language: Language.English,
    currency: getCurrencyByLocale(navigator.language)
}

const headerSlice = createSlice({
    name: "headerSlice",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            const language = action.payload;
            state.language = language;
            // Update currency when language changes
            state.currency = getCurrencyByLocale(language.toLowerCase());
        },
        setCurrency: (state, action: PayloadAction<{ code: string; symbol: string }>) => {
            state.currency = action.payload;
        }
    }
});

export const { setLanguage, setCurrency } = headerSlice.actions;
export default headerSlice.reducer;