import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from './select';
import { Button } from './button';

interface GuestCount {
  [key: string]: number;
}

interface GuestSelectorProps {
  onChange: (counts: GuestCount) => void;
}

export function GuestSelector({ onChange }: GuestSelectorProps) {
  const config = useSelector((state: RootState) => state.landingConfig.config);
  const [counts, setCounts] = useState<GuestCount>({});
  
  // Initialize guest counts when config is loaded
  useEffect(() => {
    if (config?.guest_types) {
      setCounts(
        config.guest_types.reduce((acc, type) => ({
          ...acc,
          [type.guestType]: 0
        }), {})
      );
    }
  }, [config?.guest_types]);

  const handleChange = (type: string, increment: boolean) => {
    if (!config?.guest_types) return;
    
    const guestType = config.guest_types.find(gt => gt.guestType === type);
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

  // If config or guest_types aren't available, don't render
  if (!config?.guest_types || !config.guest_options?.show) return null;

  return (
    <Select>
      <SelectTrigger 
        className="w-full px-[1.1875rem] py-[0.75rem] !h-[3rem] text-[#858685] rounded-[0.25rem] border border-gray-300"
        style={{ height: '3rem' }}
      >
        <SelectValue 
          placeholder={totalGuests > 0 ? `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}` : "Guests"} 
          style={{ 
            fontStyle: 'italic',
            color: '#2F2F2F', 
            fontWeight: 'normal'
          }}
        />
      </SelectTrigger>
      <SelectContent>
        {config.guest_types.map((guestType) => (
          <div key={guestType.id} className="flex items-center justify-between py-2 px-3 w-[18.25rem]">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#2F2F2F]">
                {guestType.guestType}
              </span>
              {guestType.description && (
                <span className="text-xs text-[#858685]">
                  {guestType.description}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => handleChange(guestType.guestType, false)}
                disabled={!counts[guestType.guestType]}
              >
                -
              </Button>
              <span className="w-4 text-center">{counts[guestType.guestType] || 0}</span>
              <Button
                type="button"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => handleChange(guestType.guestType, true)}
                disabled={counts[guestType.guestType] >= (guestType.maxCount || 0)}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
