import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setSelectedPropertyId,
  setSelectedDateRange,
  deserializeDateRange
} from "@/redux/slices/roomRatesSlice";
import {
  setBedTypes,
  toggleBedType,
  setRatings,
  toggleRating,
  setAmenities,
  toggleAmenity,
  setPriceRange,
  setSortOption,
} from "@/redux/slices/roomSlice";
import { parse, format } from "date-fns";
import RoomFilters from "@/components/roomFilters/RoomFilters";
import RoomsList from "@/components/roomDetail/RoomsList";
import SearchHeader from "@/components/SearchHeader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Room() {
  const { config } = useSelector((state: RootState) => state.landingConfig);
  const serializedDateRange = useSelector(
    (state: RootState) => state.roomRates.selectedDateRange
  );
  // Convert serialized dates back to Date objects for use in the component
  const selectedDateRange = deserializeDateRange(serializedDateRange);
  
  const { filters } = useSelector((state: RootState) => state.room);
  
  const [roomCount, setRoomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [guestCounts, setGuestCounts] = useState<Record<string, number>>({});
  const [isAccessible, setIsAccessible] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId, tenantId } = useParams<{
    propertyId: string;
    tenantId: string;
  }>();

  // Set the selected property ID from URL parameter
  useEffect(() => {
    if (propertyId) {
      dispatch(setSelectedPropertyId(parseInt(propertyId, 10)));
    }
  }, [propertyId, dispatch]);

  // Flag to prevent URL updates from triggering further updates 
  // when they're initiated by filter changes
  const isFilterInitiatedUpdate = useRef(false);

  // Parse URL query parameters to populate filters
  useEffect(() => {
    // Skip processing if this update was initiated by a filter change
    if (isFilterInitiatedUpdate.current) {
      isFilterInitiatedUpdate.current = false;
      return;
    }

    const queryParams = new URLSearchParams(location.search);

    // Extract date ranges and update the Redux store
    const checkInStr = queryParams.get("checkIn");
    const checkOutStr = queryParams.get("checkOut");

    if (checkInStr && checkOutStr) {
      try {
        const from = parse(checkInStr, "yyyy-MM-dd", new Date());
        const to = parse(checkOutStr, "yyyy-MM-dd", new Date());
        dispatch(setSelectedDateRange({ from, to }));
      } catch (error) {
        console.error("Error parsing dates:", error);
      }
    }

    // Extract room count
    const roomCountParam = queryParams.get("rooms");
    if (roomCountParam) {
      setRoomCount(parseInt(roomCountParam, 10));
    }

    // Extract bed count - if present
    const bedCountParam = queryParams.get("beds");
    if (bedCountParam) {
      setBedCount(parseInt(bedCountParam, 10));
    }

    // Extract guest counts - making it case-insensitive
    const newGuestCounts: Record<string, number> = {};
    const guestTypes = config?.guest_types || [];

    // Create a map of lowercase guest type names to their original case
    const guestTypeMap: Record<string, string> = {};
    guestTypes.forEach((type) => {
      guestTypeMap[type.guestType.toLowerCase()] = type.guestType;
    });

    // Check URL parameters for both original case and lowercase versions
    Array.from(queryParams.entries()).forEach(([key, value]) => {
      // Check if this is a guest type parameter (either matching exact case or lowercase)
      const guestType = guestTypes.find(
        (type) =>
          type.guestType === key ||
          type.guestType.toLowerCase() === key.toLowerCase()
      );

      if (guestType) {
        // Store with the correct case from the config
        newGuestCounts[guestType.guestType] = parseInt(value, 10);
      } else if (
        ["adult", "adults", "child", "children", "infant", "infants"].includes(
          key.toLowerCase()
        )
      ) {
        // Common guest types might not be in config but we still want to handle them
        // Normalize keys to proper format
        let normalizedKey = key;
        // Handle common plural forms
        if (key.toLowerCase() === "adults") normalizedKey = "Adults";
        if (key.toLowerCase() === "children") normalizedKey = "Children";
        if (key.toLowerCase() === "infants") normalizedKey = "Infants";

        newGuestCounts[normalizedKey] = parseInt(value, 10);
      }
    });

    console.log("Parsed guest counts from URL:", newGuestCounts);
    console.log("URL Parameters:", Object.fromEntries(queryParams.entries()));

    if (Object.keys(newGuestCounts).length > 0) {
      setGuestCounts(newGuestCounts);
    }

    // Extract accessibility option
    const accessible = queryParams.get("accessible");
    setIsAccessible(accessible === "true");
    
    // Extract sort option if present
    const sort = queryParams.get("sort");
    if (sort) {
      dispatch(setSortOption(sort));
    }
    
    // Extract bed types
    const bedTypesParam = queryParams.get("bedTypes");
    if (bedTypesParam) {
      dispatch(setBedTypes(bedTypesParam.split(',')));
    }
    
    // Extract ratings
    const ratingsParam = queryParams.get("ratings");
    if (ratingsParam) {
      dispatch(setRatings(ratingsParam.split(',')));
    }
    
    // Extract amenities
    const amenitiesParam = queryParams.get("amenities");
    if (amenitiesParam) {
      dispatch(setAmenities(amenitiesParam.split(',')));
    }
    
    // Extract price range
    const minPrice = queryParams.get("minPrice");
    const maxPrice = queryParams.get("maxPrice");
    if (minPrice && maxPrice) {
      dispatch(setPriceRange([parseInt(minPrice, 10), parseInt(maxPrice, 10)]));
    }
    
  }, [location.search, config?.guest_types, dispatch]);

  // Handle form submission for search header
  const handleSubmit = () => {
    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add date range if selected
    if (selectedDateRange?.from) {
      queryParams.set("checkIn", format(selectedDateRange.from, "yyyy-MM-dd"));
    }
    if (selectedDateRange?.to) {
      queryParams.set("checkOut", format(selectedDateRange.to, "yyyy-MM-dd"));
    }

    // Add guest information
    Object.entries(guestCounts).forEach(([type, count]) => {
      if (count > 0) {
        queryParams.set(type, count.toString());
      }
    });

    // Add room and bed count
    queryParams.set("rooms", roomCount.toString());
    queryParams.set("beds", bedCount.toString());

    // Add accessibility if needed
    if (isAccessible) {
      queryParams.set("accessible", "true");
    }
    
    // Add sort option
    if (filters.sort && filters.sort !== "recommended") {
      queryParams.set("sort", filters.sort);
    }
    
    // Add filter parameters
    if (filters.bedTypes && filters.bedTypes.length > 0) {
      queryParams.set("bedTypes", filters.bedTypes.join(','));
    }
    
    if (filters.ratings && filters.ratings.length > 0) {
      queryParams.set("ratings", filters.ratings.join(','));
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      queryParams.set("amenities", filters.amenities.join(','));
    }
    
    if (filters.priceRange) {
      queryParams.set("minPrice", filters.priceRange[0].toString());
      queryParams.set("maxPrice", filters.priceRange[1].toString());
    }

    // Navigate to the same page but with updated filters
    navigate(`/${tenantId}/${propertyId}/rooms?${queryParams.toString()}`);
  };
  
  // Helper function to update filter and trigger URL update
  const updateFiltersAndURL = () => {
    // Set the flag to indicate this is a filter-initiated update
    isFilterInitiatedUpdate.current = true;
    
    const queryParams = new URLSearchParams(location.search);
    
    // Update bed types
    if (filters.bedTypes && filters.bedTypes.length > 0) {
      queryParams.set("bedTypes", filters.bedTypes.join(','));
    } else {
      queryParams.delete("bedTypes");
    }
    
    // Update ratings
    if (filters.ratings && filters.ratings.length > 0) {
      queryParams.set("ratings", filters.ratings.join(','));
    } else {
      queryParams.delete("ratings");
    }
    
    // Update amenities
    if (filters.amenities && filters.amenities.length > 0) {
      queryParams.set("amenities", filters.amenities.join(','));
    } else {
      queryParams.delete("amenities");
    }
    
    // Update price range
    if (filters.priceRange) {
      queryParams.set("minPrice", filters.priceRange[0].toString());
      queryParams.set("maxPrice", filters.priceRange[1].toString());
    }
    
    // Navigate with updated query params
    navigate(`/${tenantId}/${propertyId}/rooms?${queryParams.toString()}`);
  };
  
  // Handle bed type filter change
  const handleBedTypeChange = (bedType: string) => {
    dispatch(toggleBedType(bedType));
    
    // Schedule URL update outside React's rendering cycle
    setTimeout(() => updateFiltersAndURL(), 0);
  };
  
  // Handle rating filter change
  const handleRatingChange = (rating: string) => {
    dispatch(toggleRating(rating));
    
    // Schedule URL update outside React's rendering cycle
    setTimeout(() => updateFiltersAndURL(), 0);
  };
  
  // Handle amenity filter change
  const handleAmenityChange = (amenity: string) => {
    dispatch(toggleAmenity(amenity));
    
    // Schedule URL update outside React's rendering cycle
    setTimeout(() => updateFiltersAndURL(), 0);
  };
  
  // Handle price range filter change
  const handlePriceRangeChange = (values: number[]) => {
    dispatch(setPriceRange([values[0], values[1]]));
    
    // Debounce the URL update to avoid too many history entries
    if (priceRangeUpdateTimeout.current) {
      clearTimeout(priceRangeUpdateTimeout.current);
    }
    
    priceRangeUpdateTimeout.current = setTimeout(() => {
      updateFiltersAndURL();
    }, 500);
  };
  
  // Timeout ref for price range debouncing
  const priceRangeUpdateTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Handle sort option change
  const handleSortChange = (value: string) => {
    dispatch(setSortOption(value));
    
    // Set the flag to indicate this is a filter-initiated update
    isFilterInitiatedUpdate.current = true;
    
    // Update URL with the new sort option
    const queryParams = new URLSearchParams(location.search);
    if (value !== "recommended") {
      queryParams.set("sort", value);
    } else {
      queryParams.delete("sort");
    }
    navigate(`/${tenantId}/${propertyId}/rooms?${queryParams.toString()}`);
  };

  return (
    <div className="mt-[5.25rem] flex flex-col">
      {/* for property image */}
      <div className="h-[12rem] bg-[#858685] w-full"></div>
      {/* for timeline component */}
      <div className="h-[5.75rem] flex justify-center items-center bg-[#E4E4E4] border-[1px] border-[#E4E4E4]"></div>
      
      {/* Search Header Component */}
      <SearchHeader 
        guestCounts={guestCounts}
        setGuestCounts={setGuestCounts}
        roomCount={roomCount}
        setRoomCount={setRoomCount}
        bedCount={bedCount}
        setBedCount={setBedCount}
        config={config}
        handleSubmit={handleSubmit}
      />
      
      <div className="mt-[34px] flex ml-[86px] mr-[86px]">
        <RoomFilters 
          selectedBedTypes={filters.bedTypes || []}
          onBedTypeChange={handleBedTypeChange}
          selectedRatings={filters.ratings || []}
          onRatingChange={handleRatingChange}
          selectedAmenities={filters.amenities || []}
          onAmenityChange={handleAmenityChange}
          priceRange={filters.priceRange || [50, 500]}
          onPriceRangeChange={handlePriceRangeChange}
        />
        <div className="flex-1 ml-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Room Results</h2>
            <div className="flex items-center">
              <p className="text-sm text-gray-700 mr-3">Showing 1-4 of 5 Results</p>
              <p className="text-gray-400 mx-2">|</p>
              <div className="flex items-center">
                <Select 
                  value={filters.sort !== "recommended" ? filters.sort : undefined} 
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-fit h-10 text-sm bg-white border-0 shadow-none focus:ring-0 focus:ring-offset-0 hover:bg-white hover:shadow-none hover:border-0 hover:ring-0">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="price-low-high">Low to High</SelectItem>
                      <SelectItem value="price-high-low">High to Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
         
          {/* Rooms available */}
          <div className="flex flex-wrap">
             <RoomsList 
               filters={{
                 bedTypes: filters.bedTypes || [],
                 ratings: filters.ratings || [],
                 amenities: filters.amenities || [],
                 priceRange: filters.priceRange || [50, 500],
                 sort: filters.sort || 'recommended'
               }}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
