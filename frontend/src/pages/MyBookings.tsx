import { useIntl } from 'react-intl';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyBookings = ({ changeLanguage }: { changeLanguage: (language: 'en' | 'es' | 'fr' | 'de' | 'it') => void }) => {
  const intl = useIntl();

  const handleError = () => {
    
    throw new Error('This is a test error for Sentry');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header changeLanguage={changeLanguage} />
      <main className="flex-grow flex justify-center items-center">
        <h1 className="text-2xl text-gray-600">{intl.formatMessage({ id: 'noBooking', defaultMessage: 'No booking' })}  <button onClick={handleError}>Test Sentry</button></h1>
      </main>
      
     
      
      <Footer />
    </div>
  );
};

export default MyBookings;
