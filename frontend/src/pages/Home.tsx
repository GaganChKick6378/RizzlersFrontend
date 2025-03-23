import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { Checkbox } from "@/components/ui/checkbox";
import { GuestSelector } from "@/components/ui/GuestSelector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

import { PiWheelchairBold } from "react-icons/pi";

import { setSelectedPropertyId } from "../redux/slices/roomRatesSlice";
import { fetchLandingConfig } from "../redux/slices/landingConfigSlice";
import { detectUserCurrency } from "../redux/slices/currencySlice";

const Home: React.FC = () => {
  const { tenantId = "1" } = useParams<{ tenantId: string }>();
  const { config, loading, error } = useSelector(
    (state: RootState) => state.landingConfig
  );
  const { selectedPropertyId } = useSelector(
    (state: RootState) => state.roomRates
  );
  // selectedCurrency will be used for price conversion in the UI
  
  const dispatch = useDispatch<AppDispatch>();

  // Fetch config when tenant ID changes
  useEffect(() => {
    const numericTenantId = parseInt(tenantId, 10);
    if (!isNaN(numericTenantId)) {
      dispatch(fetchLandingConfig(numericTenantId));
    }
  }, [tenantId, dispatch]);

  // Detect user's currency after config is loaded
  useEffect(() => {
    if (config && config.currencies?.options && config.languages?.options) {
      // Detect user's currency and language based on browser locale
      dispatch(detectUserCurrency());
      
      // Log for debugging
      console.log('Detecting user locale, language and currency...');
      console.log('Browser language:', navigator.language);
      console.log('Available currencies:', config.currencies.options);
      console.log('Available languages:', config.languages.options);
    }
  }, [config, dispatch]);

  const handlePropertyChange = (value: string) => {
    const selectedId = Number(value);
    dispatch(setSelectedPropertyId(selectedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!config) return null;

  // Banner image - only show if available
  const bannerStyle = config?.banner_image?.url
    ? { backgroundImage: `url(${config.banner_image.url})` }
    : { backgroundColor: "#f5f5f5" }; // Fallback background color

  return (
    <div
      className="absolute bg-cover bg-center bg-no-repeat w-screen h-[42.4375rem] top-[84px] left-1/2 -translate-x-1/2"
      style={bannerStyle}
    >
      <form className="absolute bg-white pl-[2.75rem] pr-[2.75rem] pt-[3.375rem] rounded-[0.3125rem] w-[23.75rem] h-[36.5625rem] top-[3.5rem] md:left-[78px] left-1/2 md:w-[23.75rem]">
        {/* Property Selection - only render if properties exist */}
        {config?.properties && config.properties.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-400 mb-1 text-[#2F2F2F]">
              Property name*
            </label>
            <Select
              onValueChange={handlePropertyChange}
              value={selectedPropertyId?.toString() || undefined}
            >
              <SelectTrigger
                className="w-full px-[1.1875rem] py-[0.75rem] !h-[3rem] text-[#5D5D5D] font-extralight rounded-[0.25rem] border border-gray-300"
                style={{ height: "3rem" }}
              >
                {!selectedPropertyId && <p>Select Property</p>}
                {selectedPropertyId && (
                  <span>
                    {config.properties.find(
                      (property) => property.id === selectedPropertyId
                    )?.property_name || "Property not found"}
                  </span>
                )}
              </SelectTrigger>
              <SelectContent className="text-[#5D5D5D] w-[18.25rem]">
                <SelectGroup>
                  {config.properties.map((property) => {
                    const isDisabled = !property.is_assigned;
                    return (
                      <SelectItem
                        key={property.id}
                        value={property.id.toString()}
                        disabled={isDisabled}
                        className={`text-[#5D5D5D] flex items-center gap-2 ${
                          isDisabled ? "disabled" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center space-x-2 w-full ${
                            isDisabled ? "opacity-70" : ""
                          }`}
                        >
                          <Checkbox
                            id={`property-${property.id}`}
                            checked={selectedPropertyId === property.id}
                            disabled={isDisabled}
                            className="mr-2 data-[state=checked]:bg-[#26266D] text-white data-[state=checked]:text-white border-[#C1C2C2]"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDisabled) {
                                dispatch(setSelectedPropertyId(property.id));
                              }
                            }}
                          />
                          <span>{property.property_name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Selection - only render if length_of_stay is available */}
        {config?.length_of_stay && (
          <div className="mb-4">
            <label className="block text-sm font-400 text-[#2F2F2F] mb-1">
              Select dates
            </label>
            <div className="bg-white">
              <DatePickerWithRange />
            </div>
          </div>
        )}

        {/* Guests and Rooms Section */}
        {(config?.guest_options?.show || config?.room_options?.show) && (
          <div className="mb-4 flex justify-between">
            {/* Guest Selector - only if enabled in config */}
            {config?.guest_options?.show &&
              config?.guest_types &&
              config.guest_types.length > 0 && (
                <div
                  className={
                    config?.room_options?.show ? "w-[12.5rem]" : "w-full"
                  }
                >
                  <label className="block text-sm font-400 text-[#2F2F2F] mb-1">
                    Guests
                  </label>
                  <GuestSelector
                    onChange={(counts) => {
                      console.log("Guest counts:", counts);
                    }}
                  />
                </div>
              )}

            {/* Room Selection - only if enabled in config */}
            {config?.room_options?.show &&
              config?.room_options?.max_rooms > 0 && (
                <div
                  className={
                    config?.guest_options?.show ? "w-[4.8125rem]" : "w-full"
                  }
                >
                  <label className="block text-sm font-400 text-[#2F2F2F] mb-1">
                    Rooms
                  </label>
                  <Select defaultValue="1">
                    <SelectTrigger
                      className="w-full px-[1.1875rem] py-[0.75rem] !h-[3rem] text-[#858685] rounded-[0.25rem] border border-gray-300"
                      style={{ height: "3rem" }}
                    >
                      <SelectValue
                        placeholder="1"
                        style={{
                          fontStyle: "italic",
                          color: "#858685",
                          fontWeight: "normal",
                        }}
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="text-[#858685] !w-[4.8125rem]"
                      style={{
                        width: "4.8125rem !important",
                        minWidth: "4.8125rem !important",
                      }}
                    >
                      <SelectGroup>
                        {Array.from(
                          { length: config.room_options.max_rooms },
                          (_, i) => i + 1
                        ).map((room) => (
                          <SelectItem
                            key={room}
                            value={room.toString()}
                            className="text-[#858685]"
                          >
                            {room}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
          </div>
        )}

        {/* Accessible Room Checkbox - only if enabled in config */}
        {config?.accessibility_options?.show &&
          config?.accessibility_options?.options &&
          config.accessibility_options.options.length > 0 && (
            <div className="mb-4 flex items-center gap-1">
              <input
                type="checkbox"
                id="accessible-room"
                className="h-4 w-4 text-[#130739] border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <label
                htmlFor="accessible-room"
                className="text-[0.875rem] text-[#2F2F2F] flex items-center gap-1 font-400"
              >
                <PiWheelchairBold /> <span> I need an Accessible Room</span>
              </label>
            </div>
          )}

        {/* Search Button - always displayed */}
        <button
          type="submit"
          className={`w-[8.75rem] h-[2.75rem] py-2 mt-28 bg-[#26266D] text-white font-semibold rounded focus:outline-none focus:ring-2 mx-auto block ${
            !selectedPropertyId
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          disabled={!selectedPropertyId}
        >
          SEARCH
        </button>
      </form>
    </div>
  );
};

export default Home;
