import React, { useState } from "react";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { GuestSelector } from "@/components/ui/GuestSelector";
import { PropertyData, propertiesData } from "@/data/propertiesData";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Property } from "@/interfaces/landingConfig.interface";

const Home: React.FC = () => {
  const [selectedPropertyData, setSelectedPropertyData] = useState<PropertyData | undefined>(undefined);
  const { config, loading, error } = useSelector((state: RootState) => state.landingConfig);

  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    const propertyData = propertiesData[`property${selectedId}`];
    setSelectedPropertyData(propertyData);
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

  return (
    <div 
      className="absolute bg-cover bg-center bg-no-repeat w-full max-w-screen h-[679px] top-[84px] left-1/2 -translate-x-1/2"
      style={{ backgroundImage: `url(${config.banner_image.url})` }}
    >
      <form className="absolute bg-white p-6 rounded shadow border w-[380px] h-[585px] top-[56px] md:left-[78px] left-1/2 md:transform-none -translate-x-1/2 md:-translate-x-0 md:w-[380px] w-[90%]">
        {/* Property Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property name*
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handlePropertyChange}
            defaultValue=""
          >
            <option value="" disabled>Select a property</option>
            {config.properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.property_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select dates
          </label>
          <div className="bg-white">
            <DatePickerWithRange 
              selectedProperty={selectedPropertyData}
            />
          </div>
        </div>

        {/* Guests and Rooms */}
        <div className="mb-4 flex space-x-2">
          {config.guest_options.show && (
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <GuestSelector 
                onChange={(counts) => {
                  console.log('Guest counts:', counts);
                }}
              />
            </div>
          )}
          
          {config.room_options.show && (
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rooms
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                defaultValue={1}
              >
                {Array.from({ length: config.room_options.max_rooms }, (_, i) => i + 1).map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Accessible Room Checkbox */}
        {config.accessibility_options.show && (
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="accessible-room"
              className="h-4 w-4 text-[#130739] border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="accessible-room" className="ml-2 text-sm text-gray-700">
              I need an Accessible Room
            </label>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="w-1/2 py-2 mt-15 bg-[#130739] text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-auto block"
        >
          SEARCH
        </button>
      </form>
    </div>
  );
};

export default Home;
