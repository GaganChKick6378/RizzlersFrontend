import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchLandingConfig } from '../redux/slices/landingConfigSlice';
import { Button } from '../components/ui/button';

const MyBookings = () => {
  const intl = useIntl();
  const { tenantId = "1" } = useParams<{ tenantId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  // Fetch config when tenant ID changes
  useEffect(() => {
    const numericTenantId = parseInt(tenantId, 10);
    if (!isNaN(numericTenantId)) {
      dispatch(fetchLandingConfig(numericTenantId));
    }
  }, [tenantId, dispatch]);

  const handleError = () => {
    throw new Error('This is a test error for Sentry');
  };
  
  return (
    <div className="flex justify-center items-center py-20">
      <h1 className="text-2xl text-gray-600">
        {intl.formatMessage({ id: 'noBooking', defaultMessage: 'No booking' })}  
        <button onClick={handleError}>Test Sentry</button>
        <Button>Click Here</Button>
      </h1>
    </div>
  );
};

export default MyBookings;
