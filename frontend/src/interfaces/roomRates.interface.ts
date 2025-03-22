export interface DailyRate {
  date: string;
  minimum_rate: number;
  has_promotion: boolean;
  price_factor: number;
  discounted_rate: number;
}

export interface RoomRatesState {
  rates: DailyRate[];
  loading: boolean;
  error: string | null;
}
