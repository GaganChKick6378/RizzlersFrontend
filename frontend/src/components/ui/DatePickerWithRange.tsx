"use client"

import * as React from "react"
import { addDays, format, eachDayOfInterval } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PropertyData } from "@/data/propertiesData"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedProperty?: PropertyData;
}

export function DatePickerWithRange({
  className,
  selectedProperty,
}: DatePickerWithRangeProps) {
  // Remove default date selection
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const [error, setError] = React.useState<string | null>(null);
  const config = useSelector((state: RootState) => state.landingConfig.config);

  // Generate array of all possible dates for the next year
  const allDates = React.useMemo(() => {
    const today = new Date();
    const nextYear = addDays(today, 365);
    return eachDayOfInterval({ start: today, end: nextYear });
  }, []);

  // Get available dates for selected property
  const availableDates = React.useMemo(() => {
    if (!selectedProperty?.rates) return [];
    return selectedProperty.rates.map(rate => new Date(rate.date));
  }, [selectedProperty]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange?.from) {
      setDate(selectedRange);
      setError(null);
      return;
    }

    // If only start date is selected
    if (!selectedRange.to) {
      // Verify the selected date is available
      const isAvailable = availableDates.some(
        date => format(date, 'yyyy-MM-dd') === format(selectedRange.from, 'yyyy-MM-dd')
      );
      if (!isAvailable) {
        setError("Selected date is not available");
        return;
      }
      setDate(selectedRange);
      setError(null);
      return;
    }

    // Verify all dates in range are available
    const rangeDates = eachDayOfInterval({
      start: selectedRange.from,
      end: selectedRange.to
    });

    const allDatesAvailable = rangeDates.every(date =>
      availableDates.some(
        availableDate => format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    );

    if (!allDatesAvailable) {
      setError("Some dates in the selected range are not available");
      return;
    }

    const stayDuration = Math.ceil(
      (selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1; // Add 1 because range is inclusive

    if (stayDuration < config!.length_of_stay.min) {
      setError(`Minimum stay duration is ${config!.length_of_stay.min} days`);
      return;
    }

    if (stayDuration > config!.length_of_stay.max) {
      setError(`Maximum stay duration is ${config!.length_of_stay.max} days`);
      return;
    }

    setDate(selectedRange);
    setError(null);
  };

  const { currency } = useSelector((state: RootState) => state.header);

  // Function to get price for a specific date
  const getPriceForDate = (date: Date) => {
    if (!selectedProperty?.rates) return null;
    
    const dateStr = format(date, "yyyy-MM-dd");
    const rateInfo = selectedProperty.rates.find(rate => rate.date === dateStr);
    
    if (!rateInfo) return null;

    const { minimum_rate, has_promotion, discounted_rate } = rateInfo;
    if (has_promotion) {
      return (
        <div className="text-center text-[10px] mt-1">
          <span className="line-through text-gray-500">{currency.symbol}{minimum_rate}</span>
          <br />
          <span className="text-gray-500">{currency.symbol}{discounted_rate}</span>
        </div>
      );
    }
    return <div className="text-center text-[10px] text-gray-500 mt-1">{currency.symbol}{minimum_rate}</div>;
  };

  const calendarClassName = cn(
    "rdp-custom",
    "[&_.rdp-day]:h-10 [&_.rdp-day]:w-10",
    "[&_.rdp-day_button:hover]:bg-[#eff0f1]",
    "[&_.rdp-day_button:focus]:bg-[#eff0f1]",
    "[&_.rdp-day_button.rdp-day_selected]:bg-[#2f2f2f]",
    "[&_.rdp-day_button.rdp-day_selected]:text-white",
    "[&_.rdp-day_button.rdp-day_selected]:hover:bg-[#2f2f2f]",
    "[&_.rdp-day_button]:h-10 [&_.rdp-day_button]:w-10",
    // Add alignment classes
    "[&_.rdp-tbody]:space-y-1",
    "[&_.rdp-cell]:p-0"
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full px-3 py-2 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="text-sm">
                {date?.from ? (
                  date.to ? (
                    <>Check-in &nbsp;&nbsp;→&nbsp;&nbsp; Check-out</>
                  ) : (
                    "Check-in"
                  )
                ) : (
                  "Check-in → Check-out"
                )}
              </div>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 date-picker-popover" align="center">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ 
              before: new Date(),
              after: addDays(new Date(), 365), // Disable dates more than a year ahead
              dates: selectedProperty ? 
                allDates.filter(date => 
                  !availableDates.some(
                    availableDate => 
                      format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                  )
                ) : []
            }}
            className={calendarClassName}
            modifiersStyles={{
              today: {
                fontWeight: 'bold'
              },
              selected: {
                backgroundColor: '#2f2f2f',
                color: 'white'
              },
              disabled: {
                color: '#ccc'
              }
            }}
            footer={
              <div className="p-3 text-sm">
                {error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  selectedProperty && date?.from && (
                    <div>Selected date price: {getPriceForDate(date.from)}</div>
                  )
                )}
              </div>
            }
            components={{
              DayContent: ({ date: dayDate }) => (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="text-sm">{dayDate.getDate()}</div>
                  {selectedProperty && getPriceForDate(dayDate)}
                </div>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
