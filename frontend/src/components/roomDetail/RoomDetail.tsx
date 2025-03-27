import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Room } from "@/interfaces/room.interface";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa6";
import { TiLocationOutline } from "react-icons/ti";
import { LuUserRound } from "react-icons/lu";
import { LiaBedSolid } from "react-icons/lia";

interface RoomDetailProps {
  room: Room;
  onSelect?: (roomId: number) => void;
}

export default function RoomDetail({ room, onSelect }: RoomDetailProps) {
  // Extract active special deal (first available one)
  const specialDeal = room.specialDeals.find((deal) => deal.isAvailable);

  // Format the bed types for display
  const formatBedTypes = (bedTypes: string[]) => {
    if (bedTypes.includes("queen bed") && bedTypes.includes("double bed")) {
      return "Queen or 2 doubles";
    }
    return bedTypes
      .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
      .join(" or ");
  };

  return (
    <div className={`flex flex-col rounded-[5px] border-[1px] border-[#EFF0F1] shadow-sm bg-white ${specialDeal ? 'max-h-[513px]' : 'max-h-[450px]'} w-[293px]`}>
      {/* Image Carousel */}
      <div className="h-[145px] relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          className="w-full h-full"
        >
          {room.roomImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Room view ${index + 1}`}
                className="w-full h-full object-cover rounded-t-[5px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Room Details */}
      <div className="p-4">
        {/* Room Name and Rating */}
        <div className="flex justify-between items-start">
          <h3 className="text-[1rem] font-700 w-[136.6px]">
            Long Beautiful
            <br />
            Resort Name
          </h3>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <FaStar className="w-5 h-5 fill-[#26266D] text-[#26266D]" />
              <span className="ml-1 text-[1rem] text-[#2F2F2F] font-700">
                {room.ratings.stars}
              </span>
            </div>
            <span className="text-sm text-[#5D5D5D] font-400">
              {room.ratings.reviews} reviews
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex font-400 items-center text-[#5D5D5D] text-[14px] mt-[10px] h-[15px] min-w-[113px] max-w-fit">
          <TiLocationOutline className="w-[11.31px] h-[13.37px] mr-1"/>
          <span>{room.landmark || "Near city center"}</span>
        </div>

        {/* Room Features */}
        <div className="flex text-[#5D5D5D] text-[1rem] font-400 w-[135px] h-[18px] gap-2 mt-[10px]">
          <span className="italic">Inclusive</span>
          <span>{room.area}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center text-[#5D5D5D] text-[14px] font-400 mt-[10px] gap-2 min-w-[59px] max-w-fit">
          <LuUserRound className="w-[16px] h-[16px]"/>
          <span>{room.capacity <= 2 ? "1-2" : `1-${room.capacity}`}</span>
        </div>

        {/* Bed Types */}
        <div className="flex items-center text-[#5D5D5D] text-[14px] font-400 mt-[7px] gap-2 min-w-[149px] max-w-fit">
          <LiaBedSolid className="w-[16px] h-[16px]"/>
          <span>{formatBedTypes(room.bedTypes)}</span>
        </div>

        {/* Special Deal Section */}
        {specialDeal && (
          <div className="flex flex-col gap-[7px] mt-[12px] font-400 w-[120.76px]">
            <div 
              className="relative flex items-center bg-[#26266D] h-[2rem] text-white text-[1rem] -ml-4 pl-5"
              style={{
                clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%)"
              }}
            >
              Special deal
            </div>
            <div className="min-w-[248px] w-fit">
              <p className="text-[#5D5D5D] text-[14px]">{specialDeal.title}</p>
            </div>
          </div>
        )}

        {/* Price and Button */}
        <div className="mt-[8px]">
          <div className="flex flex-col">
            <span className="font-bold text-[1rem] h-[19px]">${room.price}</span>
            <span className="text-[#858685] font-400 ml-1 h-[21px] mt-[4px]">per night</span>
          </div>

          <Button
            className="w-[128px] h-[44px] rounded-[4px] bg-[#26266D] text-white hover:bg-[#1e1e4e] mt-[12px]"
            onClick={() => onSelect && onSelect(room.roomId)}
          >
            SELECT ROOM
          </Button>
        </div>
      </div>
    </div>
  );
}
