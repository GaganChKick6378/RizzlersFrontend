export interface DailyRate {
  date: string;
  minimum_rate: number;
  has_promotion: boolean;
  price_factor: number;
  discounted_rate: number;
}

// Serializable version of DateRange for Redux
export interface SerializableDateRange {
  from: string | null;
  to: string | null;
}

export interface RoomRatesState {
  rates: DailyRate[];
  loading: boolean;
  error: string | null;
  selectedDateRange: SerializableDateRange | null;
  selectedPropertyId: number | null;
}
