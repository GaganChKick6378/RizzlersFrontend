"use client";
import * as React from "react";
import {
  format,
  startOfToday,
  differenceInDays,
  isBefore,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";

import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import FormattedPrice from "../ui/FormattedPrice";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchDailyRates, setSelectedDateRange } from "../../redux/slices/roomRatesSlice";
import { DailyRate } from "../../interfaces/roomRates.interface";

// Custom hook for responsive design
function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const dispatch = useDispatch<AppDispatch>();
  const today = startOfToday();
  const [open, setOpen] = React.useState(false);
  
  // Responsive breakpoint - true if mobile
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Get data from Redux store
  const { config } = useSelector((state: RootState) => state.landingConfig);
  const { rates, selectedDateRange, selectedPropertyId, loading } = useSelector((state: RootState) => state.roomRates);
  
  // Get the currency from header state
  const { currency } = useSelector((state: RootState) => state.header);
  
  const maxStayDuration = config?.length_of_stay?.max || 14; // Default to 14 if not available
  const minStayDuration = config?.length_of_stay?.min || 1; // Default to 1 if not available

  // State to track current month display
  const [currentMonth, setCurrentMonth] = React.useState<Date>(today);
  const rightMonth = addMonths(currentMonth, 1);

  // Fetch rates when property is selected
  React.useEffect(() => {
    if (selectedPropertyId) {
      dispatch(fetchDailyRates({ tenantId: 1, propertyId: selectedPropertyId }));
    }
  }, [selectedPropertyId, dispatch]);

  React.useEffect(() => {
    if (selectedDateRange?.from && !isSameMonth(selectedDateRange.from, currentMonth) && !isSameMonth(selectedDateRange.from, rightMonth)) {
      setCurrentMonth(selectedDateRange.from);
    }
  }, [selectedDateRange?.from, currentMonth, rightMonth]);
  
  // Add custom CSS for date range hover effect and padding
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .rdp-day_selected, .rdp-day_range_start, .rdp-day_range_end {
        padding: 0.25rem !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSelect = (newRange: DateRange | undefined) => {
    if (newRange?.from && newRange?.to) {
      const diff = differenceInDays(newRange.to, newRange.from);
      // Check for both min and max stay duration
      if (diff > maxStayDuration || diff < minStayDuration) return;
    }
    dispatch(setSelectedDateRange(newRange || null));
  };

  const isDisabled = (day: Date): boolean => {
    // Always disable dates in the past
    if (isBefore(day, today)) return true;
    
    // If we have a start date but no end date yet
    if (selectedDateRange?.from && !selectedDateRange.to) {
      const diff = differenceInDays(day, selectedDateRange.from);
      
      // Disable dates that would result in stays longer than max duration
      if (diff > maxStayDuration) return true;
      
      // Disable dates that would result in stays shorter than min duration
      // (But don't disable the date exactly at min stay)
      if (diff < minStayDuration - 1) return true;
    }
    
    return false;
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };
  
  // Function to get price for a specific date
  const getPriceForDate = (day: Date): DailyRate | null => {
    // Make sure rates is an array before using find()
    if (!Array.isArray(rates)) return null;
    
    const formattedDate = format(day, "yyyy-MM-dd");
    return rates.find(rate => rate.date === formattedDate) || null;
  };
  
  // Custom day content renderer - separated from the Day component
  const renderDayContents = (day: Date) => {
    const rateInfo = getPriceForDate(day);
    const isRangeEnd = selectedDateRange?.from && selectedDateRange?.to && 
      (day.getTime() === selectedDateRange.from.getTime() || day.getTime() === selectedDateRange.to.getTime());
    
    // Apply currency conversion
    const convertRate = (rate: number) => {
      // Use multiplier if available, otherwise default to 1 (no conversion)
      const multiplier = currency.multiplier ?? 1;
      return Math.round(rate * multiplier * 100) / 100;
    };
    
    return (
      <>
        <div>{format(day, "d")}</div>
        {loading ? (
          <div className="text-xs mt-1 text-gray-400">...</div>
        ) : rateInfo !== null ? (
          <div className={`text-xs mt-1 font-medium ${isRangeEnd ? 'text-white' : ''}`}>
            {rateInfo.has_promotion ? (
              <>
                <div className={`line-through text-xs ${isRangeEnd ? 'text-white opacity-70' : 'text-gray-400'}`}>
                  <FormattedPrice 
                    amount={convertRate(rateInfo.minimum_rate)}
                    currencyCode={currency.code}
                    currencySymbol={currency.symbol}
                  />
                </div>
                <div>
                  <FormattedPrice 
                    amount={convertRate(rateInfo.discounted_rate)}
                    currencyCode={currency.code}
                    currencySymbol={currency.symbol}
                  />
                </div>
              </>
            ) : (
              <div>
                <FormattedPrice 
                  amount={convertRate(rateInfo.minimum_rate)}
                  currencyCode={currency.code}
                  currencySymbol={currency.symbol}
                />
              </div>
            )}
          </div>
        ) : null}
      </>
    );
  };

  const handleApplyDates = () => {
    // Close the popover when apply button is clicked
    setOpen(false);
  };

  // Function to calculate the total price for the selected date range
  const calculateTotalPrice = (): number | null => {
    if (!selectedDateRange?.from || !selectedDateRange?.to || !Array.isArray(rates)) return null;
    
    let totalPrice = 0;
    const startDate = new Date(selectedDateRange.from);
    const endDate = new Date(selectedDateRange.to);
    
    // Loop through each day in the range
    const daysCount = differenceInDays(endDate, startDate) + 1;
    for (let i = 0; i < daysCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const rateInfo = getPriceForDate(currentDate);
      if (rateInfo) {
        // Apply currency conversion to each day's rate
        const rate = rateInfo.discounted_rate;
        totalPrice += rate;
      }
    }
    
    // Apply conversion to the total
    return Math.round(totalPrice * (currency.multiplier ?? 1) * 100) / 100;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className={cn("relative", className)}>
      <Popover open={open && !!selectedPropertyId} onOpenChange={(isOpen) => selectedPropertyId && setOpen(isOpen)}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full px-4 py-3 h-12 text-left font-normal border border-gray-300 rounded",
              !selectedDateRange && "text-muted-foreground",
              !selectedPropertyId && "opacity-70 cursor-not-allowed"
            )}
            disabled={!selectedPropertyId}
            onClick={() => {
              if (!selectedPropertyId) {
                // Prevent opening if no property selected
                return;
              }
            }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-5 text-sm text-black">
                {!selectedPropertyId ? (
                  <span className="text-gray-500">Please select an property</span>
                ) : (
                  <>
                    <span>{selectedDateRange?.from ? format(selectedDateRange.from, "MMM d, yyyy") : "Check-in"}</span>
                    <span className="mx-1">→</span>
                    <span>{selectedDateRange?.to ? format(selectedDateRange.to, "MMM d, yyyy") : "Check-out"}</span>
                    
                  </>
                )}
              </div>
              <CalendarIcon className="h-5 w-5 text-black" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "absolute left-0 top-full mt-2 bg-white shadow-md z-50", 
            isMobile ? "w-[20rem]" : "w-[56rem]"
          )}
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <div className={cn("h-auto", isMobile ? "max-h-[31.375rem]" : "h-[31.375rem]")}>
            {isMobile ? (
              // Mobile view - One month
              <div className="w-full p-2">
                <div className="flex items-center mb-4 justify-between">
                  <button
                    onClick={prevMonth}
                    className="h-6 w-6 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-[1.5rem] h-[1.5rem] text-[#C1C2C2]" />
                  </button>
                  <span className="text-lg font-400 text-[#5D5D5D]">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="h-6 w-6 flex items-center justify-center"
                  >
                    <ChevronRight className="w-[1.5rem] h-[1.5rem] text-[#C1C2C2]" />
                  </button>
                </div>
              </div>
            ) : (
              // Desktop view - Two months
              <div className="flex space-x-8">
                <div className="w-full pl-2">
                  <div className="flex items-center mb-4 justify-start">
                    <span className="text-lg font-400 text-[#5D5D5D]">{format(currentMonth, "MMMM")}</span>
                    <button
                      onClick={prevMonth}
                      className="h-6 w-6 flex items-center justify-center ml-[1.4375rem]"
                    >
                      <ChevronLeft className="w-[1.5rem] h-[1.5rem] text-[#C1C2C2]" />
                    </button>
                    
                    <button
                      onClick={nextMonth}
                      className="h-6 w-6 flex items-center justify-center"
                    >
                      <ChevronRight className="w-[1.5rem] h-[1.5rem] text-[#C1C2C2]" />
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex items-center mb-4 justify-start">
                    <span className="text-lg font-400 text-[#5D5D5D]">{format(rightMonth, "MMMM")}</span>
                    <button
                      onClick={prevMonth}
                      className="h-6 w-6 flex items-center justify-center ml-[1.4375rem]"
                    >
                      <ChevronLeft className="w-[1.5rem] h-[1.5rem] text-[#C1C2C2]" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="h-6 w-6 flex items-center justify-center"
                    >
                      <ChevronRight className="w-[1.5rem] h-[1.5rem] text-[#C1C2C2]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Calendar
              initialFocus
              mode="range"
              defaultMonth={currentMonth}
              month={currentMonth}
              selected={selectedDateRange || undefined}
              onSelect={handleSelect}
              numberOfMonths={isMobile ? 1 : 2}
              disabled={isDisabled}
              weekStartsOn={0}
              modifiers={{
                today: []  // Empty array to disable today highlighting
              }}
              modifiersStyles={{
                day_range_start: { backgroundColor: "#26266D", color: "white", fontWeight: "bold", padding: "0.25rem" },
                day_range_end: { backgroundColor: "#26266D", color: "white", fontWeight: "bold", padding: "0.25rem" },
                day_range_middle: { backgroundColor: "#C1C2C2", color: "black" },
                selected: { backgroundColor: "#26266D", color: "white", fontWeight: "bold", padding: "0.25rem" }
              }}
              classNames={{
                months: isMobile ? "" : "flex space-x-9",
                month: "w-full relative",
                caption: "hidden",
                nav: "hidden",
                table: "w-full border-collapse",
                head_row: "flex justify-between text-gray-600 text-sm font-medium mb-2",
                head_cell: "w-10 text-center",
                row: "flex justify-between gap-2", 
                cell: isMobile ? "mb-7 flex flex-col items-center justify-center" : "w-[50px] mb-7 flex flex-col items-center justify-center",
                day: isMobile ? "flex flex-col items-center justify-center" : "w-[50px] flex flex-col items-center justify-center", 
                day_today: "",  // Empty string to remove today styling
                day_selected: "!bg-[#26266D] !text-white !font-bold !p-1 !min-h-15",
                day_range_start: "!bg-[#26266D] !text-white !font-bold !p-1",
                day_range_end: "!bg-[#26266D] !text-white !font-bold !p-1",
                day_range_middle: "!bg-[#C1C2C2] !text-black",
                day_disabled: "!text-gray-400 !cursor-not-allowed",
              }}
              formatters={{
                formatDay: (date) => {
                  const rateInfo = getPriceForDate(date);
                  const dayHeight = rateInfo?.has_promotion ? "h-[58px]" : "h-[40px]";
                  
                  return (
                    <div className={`flex flex-col items-center justify-center ${dayHeight}`}>
                      {renderDayContents(date)}
                    </div>
                  );
                },
                formatWeekdayName: (day) => {
                  const weekdayLabels = ["SU", "M", "T", "W", "TH", "F", "S"];
                  return <span className="text-[#858685]">{weekdayLabels[day.getDay()]}</span>;
                }
              }}
            />
          </div>
          
          <div className="p-4 border-t border-gray-200 flex flex-col">
            <div className={cn("flex justify-between items-center w-full mb-2", isMobile && "flex-col gap-3")}>
              <div className="flex flex-col">
                {selectedDateRange?.from && selectedDateRange?.to && (
                  loading ? (
                    <span className="text-gray-600 font-medium">Calculating total price...</span>
                  ) : totalPrice !== null ? (
                    <span className="text-[#26266D] font-semibold text-lg">
                      Total: <FormattedPrice 
                        amount={totalPrice}
                        currencyCode={currency.code}
                        currencySymbol={currency.symbol}
                      />
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">Unable to calculate price</span>
                  )
                )}
              </div>
              <Button
                className="bg-[#26266D] h-10 px-4 text-sm pt-[0.75rem] disabled:bg-[#C1C2C2] pb-[0.75rem] pl-[1.25rem] pr-[1.25rem]"
                disabled={!selectedDateRange?.from || !selectedDateRange?.to || loading}
                onClick={handleApplyDates}
              >
                APPLY DATES
              </Button>
            </div>
            <div className="text-end mt-1 w-full">
              <span className="text-red-500 text-xs w-[10.6875rem]">
                {selectedDateRange?.from && selectedDateRange?.to && (
                  differenceInDays(selectedDateRange.to, selectedDateRange.from) > maxStayDuration
                    ? `Max. length of stay: ${maxStayDuration} days`
                    : differenceInDays(selectedDateRange.to, selectedDateRange.from) < minStayDuration
                      ? `Min. length of stay: ${minStayDuration} days`
                      : ""
                )}
                {selectedDateRange?.from && !selectedDateRange?.to && 
                  `Please select end date. Max length of stay: ${maxStayDuration} days)`
                }
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}