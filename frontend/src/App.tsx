import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import MyBookings from './pages/MyBookings';
import "./utils/sentry"
import { Language } from './interfaces/language.interface';

const App = ({ changeLanguage }: Language) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header changeLanguage={changeLanguage} />
        <div className="flex-grow pt-20"> {/* pt-20 to account for the fixed header */}
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/my-bookings" element={<MyBookings changeLanguage={changeLanguage} />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
