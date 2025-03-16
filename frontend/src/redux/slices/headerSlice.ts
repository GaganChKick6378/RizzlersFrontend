import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HeaderState } from "@/interfaces/header.interface";
import { Language } from "@/enums/language.enum";

const initialState : HeaderState  = {
    language : Language.English
}

const headerSlice = createSlice ({
    name : "headerSlice",
    initialState,
    reducers:{
        setLanguage : (state , action : PayloadAction<Language>) => {
            const language = action.payload;
            state.language = language;
        }
    }
})

export const {setLanguage} = headerSlice.actions;
export default headerSlice.reducer;