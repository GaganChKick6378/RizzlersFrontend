import { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import FiGlobe from '../assets/fi_globe.svg';
import image1 from '../assets/image1.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCurrency, setLanguage } from '../redux/slices/headerSlice';
import { getCurrencyByLocale } from '../lib/currencyUtils';
import { Language } from '@/enums/language.enum';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLanguageOpen, setIsMobileLanguageOpen] = useState(false);
  const [isMobileCurrencyOpen, setIsMobileCurrencyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.header);
  const config = useSelector((state: RootState) => state.landingConfig.config);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Set initial currency based on browser language
    const defaultCurrency = getCurrencyByLocale(navigator.language);
    dispatch(setCurrency(defaultCurrency));
  }, [dispatch]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleCurrencyDropdown = () => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);

  const handleLanguageChange = (lang: 'en' | 'es' | 'fr' | 'de' | 'it') => {
    dispatch(setLanguage(lang as Language));
    setIsDropdownOpen(false);
    setIsMobileLanguageOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const currencyMap = {
      'USD': { code: 'USD', symbol: '$' },
      'EUR': { code: 'EUR', symbol: '€' },
      'GBP': { code: 'GBP', symbol: '£' },
      'INR': { code: 'INR', symbol: '₹' },
    };
    dispatch(setCurrency(currencyMap[currencyCode as keyof typeof currencyMap]));
    setIsCurrencyDropdownOpen(false);
    setIsMobileCurrencyOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileLanguageOpen(false);
    setIsMobileCurrencyOpen(false);
    setIsDropdownOpen(false);
    setIsCurrencyDropdownOpen(false);
  };

  return (
    <header className="bg-[#fefefe] text-white flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-10" style={{ 
      height: '84px', 
      width: '100vw',  // Changed from 100%
      maxWidth: '100vw', // Changed from 1440px
      position: 'absolute', 
      left: '50%', 
      transform: 'translateX(-50%)',
      padding: '0 1rem'
    }}>
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src={config?.header_logo.url || image1} 
          alt={config?.header_logo.alt || "Logo"}
          className="w-[103.04px] h-[30px] cursor-pointer ml-4 md:ml-[70px] [filter:brightness(0)_saturate(100%)_invert(8%)_sepia(98%)_saturate(1062%)_hue-rotate(223deg)_brightness(97%)_contrast(88%)]" 
          onClick={() => navigate('/')}
        />
        <span className="text-[#130739] font-lato font-bold text-[20px] leading-[130%] tracking-[0px] md:ml-[5px] md:mt-[2px]">
          {config?.page_title.text || intl.formatMessage({ id: 'text' })}
        </span>
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        className="md:hidden text-[#130739] p-2"
        onClick={toggleMobileMenu}
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
        </svg>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-8 items-center">
        <a 
          href="/my-bookings" 
          className="text-sm text-[#130739] hover:text-gray-300"
          onClick={(e) => {
            e.preventDefault();
            navigate('/my-bookings');
          }}
        >
          MY BOOKINGS
        </a>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-[#130739] py-2 px-4 rounded-md"
          >
            <img src={FiGlobe} alt="Language" className="w-4 h-4 mr-1" />
            <span>{intl.formatMessage({ id: 'language' })}</span>
          </button>
          {isDropdownOpen && (
            <ul className="absolute bg-white text-black rounded shadow-lg mt-2 w-32 p-2">
              <li><button onClick={() => handleLanguageChange('en')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">English</button></li>
              <li><button onClick={() => handleLanguageChange('es')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">Español</button></li>
              <li><button onClick={() => handleLanguageChange('fr')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">Français</button></li>
              <li><button onClick={() => handleLanguageChange('de')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">Deutsch</button></li>
              <li><button onClick={() => handleLanguageChange('it')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">Italiano</button></li>
            </ul>
          )}
        </div>
        <div className="relative" ref={currencyDropdownRef}>
          <button 
            className="text-[#130739] text-sm flex items-center cursor-pointer"
            onClick={toggleCurrencyDropdown}
          >
            <span className="mr-1">{currency.symbol}</span>
            {currency.code}
          </button>
          {isCurrencyDropdownOpen && (
            <ul className="absolute bg-white text-black rounded shadow-lg mt-2 w-24 p-2">
              <li><button onClick={() => handleCurrencyChange('USD')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">USD</button></li>
              <li><button onClick={() => handleCurrencyChange('EUR')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">EUR</button></li>
              <li><button onClick={() => handleCurrencyChange('GBP')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">GBP</button></li>
              <li><button onClick={() => handleCurrencyChange('INR')} className="block py-1 px-3 hover:bg-gray-100 w-full text-left">INR</button></li>
            </ul>
          )}
        </div>
        <button className="bg-[#26266d] py-2 px-4 rounded-md text-white text-sm">LOGIN</button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
          <nav className="flex flex-col p-4">
            <a 
              href="/my-bookings"
              className="text-[#130739] py-3 border-b border-gray-200"
              onClick={(e) => {
                e.preventDefault();
                navigate('/my-bookings');
                setIsMobileMenuOpen(false);
              }}
            >
              MY BOOKINGS
            </a>

            {/* Language Selection */}
            <div className="py-3 border-b border-gray-200">
              <button
                onClick={() => setIsMobileLanguageOpen(!isMobileLanguageOpen)}
                className="flex items-center text-[#130739] w-full"
              >
                <img src={FiGlobe} alt="Language" className="w-4 h-4 mr-2" />
                <span>{intl.formatMessage({ id: 'language' })}</span>
              </button>
              {isMobileLanguageOpen && (
                <div className="mt-2 pl-6">
                  <button onClick={() => handleLanguageChange('en')} className="block py-2 text-[#130739] w-full text-left">English</button>
                  <button onClick={() => handleLanguageChange('es')} className="block py-2 text-[#130739] w-full text-left">Español</button>
                  <button onClick={() => handleLanguageChange('fr')} className="block py-2 text-[#130739] w-full text-left">Français</button>
                  <button onClick={() => handleLanguageChange('de')} className="block py-2 text-[#130739] w-full text-left">Deutsch</button>
                  <button onClick={() => handleLanguageChange('it')} className="block py-2 text-[#130739] w-full text-left">Italiano</button>
                </div>
              )}
            </div>

            {/* Currency Selection */}
            <div className="py-3 border-b border-gray-200">
              <button
                onClick={() => setIsMobileCurrencyOpen(!isMobileCurrencyOpen)}
                className="flex items-center text-[#130739] w-full"
              >
                <span className="mr-1">{currency.symbol}</span>
                {currency.code}
              </button>
              {isMobileCurrencyOpen && (
                <div className="mt-2 pl-6">
                  <button onClick={() => handleCurrencyChange('USD')} className="block py-2 text-[#130739] w-full text-left">USD</button>
                  <button onClick={() => handleCurrencyChange('EUR')} className="block py-2 text-[#130739] w-full text-left">EUR</button>
                  <button onClick={() => handleCurrencyChange('GBP')} className="block py-2 text-[#130739] w-full text-left">GBP</button>
                  <button onClick={() => handleCurrencyChange('INR')} className="block py-2 text-[#130739] w-full text-left">INR</button>
                </div>
              )}
            </div>

            {/* Login Button */}
            <button className="bg-[#26266d] py-2 px-4 rounded-md text-white text-sm mt-3">
              LOGIN
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;