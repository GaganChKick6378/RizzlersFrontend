import { Language } from "@/enums/language.enum"

export interface HeaderState {
    language: Language;
    currency: {
        code: string;
        symbol: string;
    };
}