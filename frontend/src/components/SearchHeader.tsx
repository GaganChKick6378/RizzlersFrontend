import { GuestSelector } from "@/components/ui/GuestSelector";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { LandingConfig } from "@/interfaces/landingConfig.interface";
import "./swiperStyles.css"; // Import custom Swiper styles

interface SearchHeaderProps {
  guestCounts: Record<string, number>;
  setGuestCounts: (counts: Record<string, number>) => void;
  roomCount: number;
  setRoomCount: (count: number) => void;
  bedCount: number;
  setBedCount: (count: number) => void;
  config: LandingConfig | null;
  handleSubmit: () => void;
}

export default function SearchHeader({
  guestCounts,
  setGuestCounts,
  roomCount,
  setRoomCount,
  bedCount,
  setBedCount,
  config,
  handleSubmit,
}: SearchHeaderProps) {
  // Helper function to safely check if max_rooms is > 0
  const hasValidMaxRooms = () => {
    const maxRooms = config?.room_options?.max_rooms;
    return typeof maxRooms === 'number' && maxRooms > 0;
  };

  return (
    <div className="mt-[1.875rem] flex flex-col ml-[86px] mr-[86px] sticky top-[103px] z-40 bg-white" style={{ position: 'sticky' }}>
      <div className="flex gap-4 items-stretch">
        {/* guest selector */}
        <div className="w-[264px] h-[68px] flex">
          <GuestSelector
            initialValues={guestCounts}
            onChange={(counts) => {
              setGuestCounts(counts);
            }}
          />
        </div>
        
        {/* room selector */}
        {config?.room_options?.show && hasValidMaxRooms() && (
            <div
              className={
                config?.guest_options?.show ? "w-[132px] h-[68px] flex" : "w-full h-[68px] flex"
              }
            >
              <div className="w-full h-full">
                <Select
                  value={roomCount.toString()}
                  onValueChange={(value) => setRoomCount(parseInt(value))}
                >
                  <SelectTrigger
                    className="w-full h-full px-[1.1875rem] text-[#858685] rounded-[0.25rem] border border-gray-300 flex items-center"
                    style={{ height: '68px' }}
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="text-sm font-medium text-[#2F2F2F]">
                        Rooms
                      </span>
                      <span className="text-sm text-[#858685]">
                        {roomCount}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    className="text-[#858685] !w-[4.8125rem]"
                    style={{
                      width: "4.8125rem !important",
                      minWidth: "4.8125rem !important",
                    }}
                  >
                    <SelectGroup>
                      {(() => {
                        // Safely calculate the length
                        const maxRooms = config?.room_options?.max_rooms;
                        const length = typeof maxRooms === 'number' ? maxRooms : 5;
                        
                        return Array.from(
                          { length }, 
                          (_, i) => i + 1
                        ).map((room) => (
                          <SelectItem
                            key={room}
                            value={room.toString()}
                            className="text-[#858685]"
                          >
                            {room}
                          </SelectItem>
                        ));
                      })()}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

        {/* beds selector */}
        <div className="w-[132px] h-[68px] flex">
          <div className="w-full h-full">
            <Select
              value={bedCount.toString()}
              onValueChange={(value) => setBedCount(parseInt(value))}
            >
              <SelectTrigger
                className="w-full h-full px-[1.1875rem] text-[#858685] rounded-[0.25rem] border border-gray-300 flex items-center"
                style={{ height: '68px' }}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-sm font-medium text-[#2F2F2F]">
                    Beds
                  </span>
                  <span className="text-sm text-[#858685]">{bedCount}</span>
                </div>
              </SelectTrigger>
              <SelectContent
                className="text-[#858685] !w-[4.8125rem]"
                style={{
                  width: "4.8125rem !important",
                  minWidth: "4.8125rem !important",
                }}
              >
                <SelectGroup>
                  <SelectItem value="1" className="text-[#858685]">
                    1
                  </SelectItem>
                  <SelectItem value="2" className="text-[#858685]">
                    2
                  </SelectItem>
                  <SelectItem value="3" className="text-[#858685]">
                    3
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* check in date and checkout date */}
        <div className="flex-1 h-[68px] max-w-[650px] flex">
          <DatePickerWithRange />
        </div>

        {/* search date button */}
        <div className="h-[68px] flex items-center">
          <button
            className="bg-[#26266D] text-white font-semibold py-3 px-6 h-full rounded whitespace-nowrap"
            onClick={handleSubmit}
          >
            SEARCH DATES
          </button>
        </div>
      </div>
    </div>
  );
} 