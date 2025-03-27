export interface IpLocationResponse {
  status: string;
  message?: string;
  country: string;
  currency: string;
  query: string; // IP address
}

export interface LocationState {
  loading: boolean;
  error: string | null;
  country: string;
  currency: string;
  ip: string;
  detected: boolean; // Flag to indicate if location has been detected
} 