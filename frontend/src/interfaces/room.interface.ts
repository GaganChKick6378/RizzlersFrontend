export interface Rating {
  stars: number;
  reviews: number;
}

export interface SpecialDeal {
  isAvailable: boolean;
  title: string;
  description: string;
  priceFactor: number;
}

export interface Room {
  roomId: number;
  roomImages: string[];
  roomDescription: string;
  ratings: Rating;
  landmark: string;
  area: string;
  capacity: number;
  bedTypes: string[];
  specialDeals: SpecialDeal[];
  amenities: string[];
  price: number;
  priceDescription: string;
}

export interface RoomFilters {
  bedTypes?: string[];
  ratings?: string[];
  amenities?: string[];
  priceRange?: [number, number];
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export interface RoomState {
  rooms: Room[];
  filteredRooms: Room[];
  selectedRoom: Room | null;
  loading: boolean;
  error: string | null;
  filters: RoomFilters;
} 