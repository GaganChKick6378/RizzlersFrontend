import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, RoomState } from '@/interfaces/room.interface';

// Dummy data based on the provided structure
const dummyRooms: Room[] = [
  {
    roomId: 1,
    roomImages: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c"
    ],
    roomDescription: "Luxurious room with stunning views of the city skyline. Features modern amenities and elegant decor for a comfortable stay.",
    ratings: {
      stars: 3.5,
      reviews: 125,
    },
    landmark: "Close to Central Park",
    area: "301 feet",
    capacity: 4,
    bedTypes: ["single bed", "double bed"],
    specialDeals: [
      {
        isAvailable: true,
        title: "$150 Dining Credit Package",
        description: "Spend $10 every night you stay and earn $150 in dining credit at the resort.",
        priceFactor: 0.45
      },
      {
        isAvailable: true,
        title: "Kids eat free",
        description: "Spend $10 every night you stay and earn $150 in dining credit at the resort.",
        priceFactor: 0.6
      },
    ],
    amenities: [
      "Wireless Internet Access",
      "Cable & Pay TV Channels",
      "Alarm Clock",
      "Hair Dryer"
    ],
    price: 199,
    priceDescription: "Spend $10 every night you stay and earn $150 in dining credit at the resort."
  },
  {
    roomId: 2,
    roomImages: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a"
    ],
    roomDescription: "Spacious suite with separate living area. Perfect for families or extended stays with all the comforts of home.",
    ratings: {
      stars: 4.2,
      reviews: 89,
    },
    landmark: "Near Downtown",
    area: "450 feet",
    capacity: 5,
    bedTypes: ["king bed", "sofa bed"],
    specialDeals: [
      {
        isAvailable: false,
        title: "Stay 3, Pay 2",
        description: "Book three nights and only pay for two when you stay midweek.",
        priceFactor: 0.33
      }
    ],
    amenities: [
      "Wireless Internet Access",
      "Cable & Pay TV Channels",
      "Mini Bar",
      "Coffee Maker",
      "Hair Dryer",
      "In-room Safe"
    ],
    price: 299,
    priceDescription: "Rate includes breakfast for two guests each morning of your stay."
  },
  {
    roomId: 3,
    roomImages: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061",
      "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa"
    ],
    roomDescription: "Cozy room with all essential amenities for a comfortable business or leisure stay.",
    ratings: {
      stars: 3.8,
      reviews: 112,
    },
    landmark: "Business District",
    area: "280 feet",
    capacity: 2,
    bedTypes: ["queen bed"],
    specialDeals: [
      {
        isAvailable: false,
        title: "Business Package",
        description: "Includes high-speed internet, breakfast, and late checkout.",
        priceFactor: 0.15
      }
    ],
    amenities: [
      "Wireless Internet Access",
      "Work Desk",
      "Cable & Pay TV Channels",
      "Coffee Maker",
      "Hair Dryer"
    ],
    price: 159,
    priceDescription: "Best available rate with our price match guarantee."
  }
];

// Define initial state with dummy data
const initialState: RoomState = {
  rooms: dummyRooms,
  filteredRooms: dummyRooms,
  selectedRoom: null,
  loading: false,
  error: null,
  filters: {
    bedTypes: [],
    ratings: [],
    amenities: [],
    priceRange: [50, 500],
    sort: 'recommended'
  }
};

// Create the slice
const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
      state.filteredRooms = applyFilters(action.payload, state.filters);
    },
    selectRoom: (state, action: PayloadAction<number>) => {
      state.selectedRoom = state.rooms.find(room => room.roomId === action.payload) || null;
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
    // Filter actions
    setBedTypes: (state, action: PayloadAction<string[]>) => {
      if (!state.filters.bedTypes) {
        state.filters.bedTypes = [];
      }
      state.filters.bedTypes = action.payload;
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    toggleBedType: (state, action: PayloadAction<string>) => {
      const bedType = action.payload;
      if (!state.filters.bedTypes) {
        state.filters.bedTypes = [];
      }
      
      if (state.filters.bedTypes.includes(bedType)) {
        state.filters.bedTypes = state.filters.bedTypes.filter(type => type !== bedType);
      } else {
        state.filters.bedTypes = [...state.filters.bedTypes, bedType];
      }
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    setRatings: (state, action: PayloadAction<string[]>) => {
      if (!state.filters.ratings) {
        state.filters.ratings = [];
      }
      state.filters.ratings = action.payload;
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    toggleRating: (state, action: PayloadAction<string>) => {
      const rating = action.payload;
      if (!state.filters.ratings) {
        state.filters.ratings = [];
      }
      
      if (state.filters.ratings.includes(rating)) {
        state.filters.ratings = state.filters.ratings.filter(r => r !== rating);
      } else {
        state.filters.ratings = [...state.filters.ratings, rating];
      }
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    setAmenities: (state, action: PayloadAction<string[]>) => {
      if (!state.filters.amenities) {
        state.filters.amenities = [];
      }
      state.filters.amenities = action.payload;
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    toggleAmenity: (state, action: PayloadAction<string>) => {
      const amenity = action.payload;
      if (!state.filters.amenities) {
        state.filters.amenities = [];
      }
      
      if (state.filters.amenities.includes(amenity)) {
        state.filters.amenities = state.filters.amenities.filter(a => a !== amenity);
      } else {
        state.filters.amenities = [...state.filters.amenities, amenity];
      }
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    setSortOption: (state, action: PayloadAction<string>) => {
      state.filters.sort = action.payload;
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    setFilters: (state, action: PayloadAction<{
      bedTypes?: string[];
      ratings?: string[];
      amenities?: string[];
      priceRange?: [number, number];
      sort?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
    }>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredRooms = applyFilters(state.rooms, state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        bedTypes: [],
        ratings: [],
        amenities: [],
        priceRange: [50, 500],
        sort: 'recommended'
      };
      state.filteredRooms = state.rooms;
    },
    // For testing: function to simulate loading rooms based on URL params
    fetchRoomsByParams: (state, action: PayloadAction<{ 
      tenantId: string; 
      propertyId: string; 
      checkIn: string; 
      checkOut: string;
      guests: Record<string, number>;
      filters?: {
        bedTypes: string[];
        ratings: string[];
        amenities: string[];
        priceRange: [number, number];
        sort: string;
      }
    }>) => {
      // Just log the params, but use the dummy data
      console.log('Fetching rooms with params:', action.payload);
      // We're using the dummy data, so no actual fetching happens
      state.loading = false;
      
      // If filters are provided, update the state filters
      if (action.payload.filters) {
        state.filters = {
          ...state.filters,
          ...action.payload.filters
        };
        // Apply the filters to the rooms
        state.filteredRooms = applyFilters(state.rooms, state.filters);
      } else {
        // Dummy data is already in state.rooms
        state.filteredRooms = state.rooms;
      }
    }
  }
});

// Helper function to apply filters
function applyFilters(rooms: Room[], filters: {
  bedTypes?: string[];
  ratings?: string[];
  amenities?: string[];
  priceRange?: [number, number];
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}): Room[] {
  let filteredRooms = [...rooms];
  
  // Filter by bed types
  if (filters.bedTypes && filters.bedTypes.length > 0) {
    filteredRooms = filteredRooms.filter(room => 
      room.bedTypes.some(bedType => {
        // Convert room bed type to filter format
        if (bedType === 'king bed' && filters.bedTypes && filters.bedTypes.includes('king-bed')) return true;
        if (bedType === 'queen bed' && filters.bedTypes && filters.bedTypes.includes('one-queen-bed')) return true;
        if (bedType === 'double bed' && filters.bedTypes && filters.bedTypes.includes('one-double-bed')) return true;
        // Add more conversions as needed
        return false;
      })
    );
  }

  // Filter by ratings
  if (filters.ratings && filters.ratings.length > 0) {
    filteredRooms = filteredRooms.filter(room => {
      const starRating = room.ratings.stars;
      
      return filters.ratings && filters.ratings.some(rating => {
        if (rating === 'five-star') return starRating >= 5;
        if (rating === 'four-star') return starRating >= 4 && starRating < 5;
        if (rating === 'three-star') return starRating >= 3 && starRating < 4;
        if (rating === 'less-than-three') return starRating < 3;
        return false;
      });
    });
  }

  // Filter by price range
  if (filters.priceRange && filters.priceRange.length === 2) {
    filteredRooms = filteredRooms.filter(room => 
      room.price >= filters.priceRange![0] && room.price <= filters.priceRange![1]
    );
  } else {
    // For backward compatibility with older filter format
    if (filters.minPrice !== undefined) {
      filteredRooms = filteredRooms.filter(room => room.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredRooms = filteredRooms.filter(room => room.price <= filters.maxPrice!);
    }
  }

  // Filter by amenities
  if (filters.amenities && filters.amenities.length > 0) {
    filteredRooms = filteredRooms.filter(room => 
      filters.amenities && filters.amenities.every(amenity => {
        // Convert filter amenity to room format
        if (amenity === 'wifi' && room.amenities.includes('Wireless Internet Access')) return true;
        if (amenity === 'cable-tv' && room.amenities.includes('Cable & Pay TV Channels')) return true;
        if (amenity === 'alarm-clock' && room.amenities.includes('Alarm Clock')) return true;
        if (amenity === 'hair-dryer' && room.amenities.includes('Hair Dryer')) return true;
        // Add more conversions as needed
        return false;
      })
    );
  }

  // Filter by minimum rating (backward compatibility)
  if (filters.minRating !== undefined) {
    filteredRooms = filteredRooms.filter(room => room.ratings.stars >= filters.minRating!);
  }
  
  // Apply sorting
  if (filters.sort) {
    if (filters.sort === 'price-low-high') {
      filteredRooms = [...filteredRooms].sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high-low') {
      filteredRooms = [...filteredRooms].sort((a, b) => b.price - a.price);
    }
    // 'recommended' sorting is the default order, no need to sort
  }

  return filteredRooms;
}

// Export actions and reducer
export const { 
  setRooms, 
  selectRoom, 
  clearSelectedRoom,
  setBedTypes,
  toggleBedType,
  setRatings,
  toggleRating,
  setAmenities,
  toggleAmenity,
  setPriceRange,
  setSortOption,
  setFilters, 
  clearFilters,
  fetchRoomsByParams 
} = roomSlice.actions;
export default roomSlice.reducer; 