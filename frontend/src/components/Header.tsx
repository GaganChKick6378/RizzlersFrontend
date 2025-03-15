import { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import Vector from '../assets/Vector.svg';
import FiGlobe from '../assets/fi_globe.svg';

const Header = ({ changeLanguage }: { changeLanguage: (language: 'en' | 'es' | 'fr' | 'de' | 'it') => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLanguageChange = (lang: 'en' | 'es' | 'fr' | 'de' | 'it') => {
    changeLanguage(lang);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-[#fefefe] text-white p-4 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center space-x-2">
        <span 
          className="text-[#130739] text-3xl font-bold ml-12 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          Kickdrum <span className="text-[#130739] text-lg">{intl.formatMessage({ id: 'text' })}</span>
        </span>
      </div>
      <div className="flex space-x-8 items-center">
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
        <span className="text-[#130739] text-sm flex items-center">
          <img src={Vector} alt="Currency" className="w-4 h-4 mr-1" /> USD
        </span>
        <button className="bg-[#26266d] py-2 px-4 rounded-md text-white text-sm">LOGIN</button>
      </div>
    </header>
  );
};

export default Header;
