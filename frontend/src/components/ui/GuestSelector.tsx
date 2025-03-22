import { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface GuestCount {
  [key: string]: number;
}

interface GuestSelectorProps {
  onChange: (counts: GuestCount) => void;
}

export function GuestSelector({ onChange }: GuestSelectorProps) {
  const config = useSelector((state: RootState) => state.landingConfig.config);
  const [counts, setCounts] = useState<GuestCount>(
    config?.guest_types.reduce((acc, type) => ({
      ...acc,
      [type.guestType]: 0
    }), {}) || {}
  );

  const handleChange = (type: string, increment: boolean) => {
    const guestType = config?.guest_types.find(gt => gt.guestType === type);
    if (!guestType) return;

    const newCounts = { ...counts };
    if (increment && newCounts[type] < guestType.maxCount) {
      newCounts[type]++;
    } else if (!increment && newCounts[type] > 0) {
      newCounts[type]--;
    }
    setCounts(newCounts);
    onChange(newCounts);
  };

  const totalGuests = Object.values(counts).reduce((sum, count) => sum + count, 0);

  if (!config) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full px-3 py-2 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 h-[42px] bg-white hover:bg-white text-gray-900 font-normal text-sm"
        >
          {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3">
        {config?.guest_types.map((guestType) => (
          <div key={guestType.id} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">{guestType.description}</span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => handleChange(guestType.guestType, false)}
              >
                -
              </Button>
              <span className="w-4 text-center">{counts[guestType.guestType]}</span>
              <Button
                type="button"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => handleChange(guestType.guestType, true)}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
