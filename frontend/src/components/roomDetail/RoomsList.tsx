import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { RootState } from "@/redux/store";
import { fetchRoomsByParams, selectRoom } from "@/redux/slices/roomSlice";
import RoomDetail from "./RoomDetail";
import { Room } from "@/interfaces/room.interface";
import { isEqual } from 'lodash';

export interface RoomsListFilters {
  bedTypes: string[];
  ratings: string[];
  amenities: string[];
  priceRange: [number, number];
  sort: string;
}

interface RoomsListProps {
  filters?: RoomsListFilters;
}

export default function RoomsList({ filters }: RoomsListProps) {
  const dispatch = useDispatch();
  const { filteredRooms, loading, error } = useSelector((state: RootState) => state.room);
  const { tenantId, propertyId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Keep a reference to the previous filters to avoid unnecessary fetches
  const prevFiltersRef = useRef<RoomsListFilters | undefined>(undefined);
  const prevSearchParamsRef = useRef<string>('');
  
  useEffect(() => {
    // Check if filters have changed
    const filtersChanged = !isEqual(prevFiltersRef.current, filters);
    
    // Check if searchParams have changed meaningfully
    const currentSearchParamsStr = searchParams.toString();
    const searchParamsChanged = prevSearchParamsRef.current !== currentSearchParamsStr;
    
    // Only fetch if something relevant has changed
    if (filtersChanged || searchParamsChanged) {
      // Parse search parameters
      const checkIn = searchParams.get('checkIn') || '';
      const checkOut = searchParams.get('checkOut') || '';
      
      // Parse guest information from URL
      const guests: Record<string, number> = {};
      searchParams.forEach((value, key) => {
        if (['Adults', 'Teens', 'Children', 'Infants'].includes(key)) {
          guests[key] = parseInt(value) || 0;
        }
      });
      
      // Fetch rooms using the parameters
      if (tenantId && propertyId) {
        dispatch(fetchRoomsByParams({
          tenantId,
          propertyId,
          checkIn,
          checkOut,
          guests,
          filters // Pass filters to API call
        }));
      }
      
      // Update refs
      prevFiltersRef.current = filters;
      prevSearchParamsRef.current = currentSearchParamsStr;
    }
  }, [dispatch, tenantId, propertyId, searchParams, filters]);

  const handleSelectRoom = (roomId: number) => {
    dispatch(selectRoom(roomId));
    // Here you could also navigate to a room detail page or open a modal
    console.log(`Room ${roomId} selected`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading rooms...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!filteredRooms.length) {
    return <div className="p-8 text-center">No rooms available matching your filters.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-y-scroll">
      {filteredRooms.map((room: Room) => (
        <RoomDetail 
          key={room.roomId} 
          room={room} 
          onSelect={handleSelectRoom}
        />
      ))}
    </div>
  );
} 