import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
  initialValues?: GuestCount;
}

export function GuestSelector({ onChange, initialValues }: GuestSelectorProps) {
  const config = useSelector((state: RootState) => state.landingConfig.config);
  const [counts, setCounts] = useState<GuestCount>(initialValues || {});
  const location = useLocation();
  
  // Check if we're on a rooms page
  const isRoomsPage = /\/\d+\/\d+\/rooms/.test(location.pathname);
  
  // Log initial values for debugging
  useEffect(() => {
    console.log('GuestSelector initialValues:', initialValues);
    if (initialValues && Object.keys(initialValues).length > 0) {
      console.log('Setting counts from initialValues:', initialValues);
      setCounts(initialValues);
    }
  }, [initialValues]);

  // Initialize guest counts when config is loaded
  useEffect(() => {
    if (config?.guest_types) {
      const initialCounts = { ...counts };
      let needsUpdate = false;
      
      // Initialize any missing types with 0
      config.guest_types.forEach(type => {
        if (initialCounts[type.guestType] === undefined) {
          initialCounts[type.guestType] = 0;
          needsUpdate = true;
        }
      });
      
      if (needsUpdate) {
        console.log('Updating guest counts with missing types:', initialCounts);
        setCounts(initialCounts);
      }
    }
  }, [config?.guest_types, counts]);

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
    
    console.log('Updated guest counts:', newCounts);
    setCounts(newCounts);
    onChange(newCounts);
  };

  const totalGuests = Object.values(counts).reduce((sum, count) => sum + count, 0);

  // Format guest counts for rooms page
  const formatDetailedGuestCounts = () => {
    if (totalGuests === 0) return "Guests";
    
    const guestParts = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => {
        // Keep original capitalization for display
        return `${count} ${type}${count !== 1 ? 's' : ''}`;
      });
    
    console.log('Formatted guest counts:', guestParts);
    return guestParts.join(', ');
  };

  // If config or guest_types aren't available, don't render
  if (!config?.guest_types || !config.guest_options?.show) return null;

  // Set different height styles based on the page
  const triggerClassName = isRoomsPage 
    ? "w-full h-full px-[1.1875rem] py-[0.75rem] text-[#858685] rounded-[0.25rem] border border-gray-300 flex items-center"
    : "w-full px-[1.1875rem] py-[0.75rem] !h-[3rem] text-[#858685] rounded-[0.25rem] border border-gray-300";
  
  const triggerStyle = isRoomsPage 
    ? { height: '68px' } 
    : { height: '3rem' };

  return (
    <Select>
      <SelectTrigger 
        className={triggerClassName}
        style={triggerStyle}
      >
        {isRoomsPage ? (
          <div className="flex flex-col items-start w-full">
            <span className="text-sm font-medium text-[#2F2F2F]">Guests</span>
            <span className="text-sm text-[#858685]">
              {formatDetailedGuestCounts()}
            </span>
          </div>
        ) : (
          <SelectValue 
            placeholder={totalGuests > 0 ? `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}` : "Guests"} 
            style={{ 
              fontStyle: 'italic',
              color: '#2F2F2F', 
              fontWeight: 'normal'
            }}
          />
        )}
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
