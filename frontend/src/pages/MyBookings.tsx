import { useIntl } from 'react-intl';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';


const MyBookings = () => {
  const intl = useIntl();

  const handleError = () => {
    throw new Error('This is a test error for Sentry');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-center">
        <h1 className="text-2xl text-gray-600">
          {intl.formatMessage({ id: 'noBooking', defaultMessage: 'No booking' })}  
          <button onClick={handleError}>Test Sentry</button>
          <Button>Aakash</Button>
        </h1>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
