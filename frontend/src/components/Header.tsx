import { useState, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FiGlobe from "../assets/fi_globe.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setCurrency, setLanguage as setLanguageAction, fetchCurrencyRate } from "../redux/slices/headerSlice";
import { detectUserLocation } from "../redux/slices/locationSlice";
import { Language } from "@/enums/language.enum";

const googleTranslateLanguageMap: Record<string, string> = {
  "EN": "en",
  "ES": "es",
  "FR": "fr",
  "DE": "de",
  "IT": "it",
};

const Header = () => {
  const params = useParams<{ tenantId?: string }>();
  const location = useLocation();

  const getTenantIdFromPath = () => {
    if (params.tenantId) return params.tenantId;

    const pathParts = location.pathname.split("/");
    if (pathParts.length > 1 && !isNaN(Number(pathParts[1]))) {
      return pathParts[1];
    }
    return "1"; 
  };

  const currentTenantId = getTenantIdFromPath();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLanguageOpen, setIsMobileLanguageOpen] = useState(false);
  const [isMobileCurrencyOpen, setIsMobileCurrencyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currency } = useSelector((state: RootState) => state.header);
  const config = useSelector((state: RootState) => state.landingConfig.config);
  const { country, currency: detectedCurrency, detected } = useSelector((state: RootState) => state.location);

  useEffect(() => {
    dispatch(detectUserLocation());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCurrencyDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set currency based on detected location if available
  useEffect(() => {
    if (detected && config?.currencies?.options) {
      // Check if the detected currency is available in the config
      const detectedCurrencyOption = config.currencies.options.find(
        (c) => c.code === detectedCurrency && c.active
      );

      if (detectedCurrencyOption) {
        // First update the currency in the state
        dispatch(
          setCurrency({
            code: detectedCurrencyOption.code,
            symbol: detectedCurrencyOption.symbol,
          })
        );
        
        // Always fetch the conversion rate from the API, even for USD
        dispatch(fetchCurrencyRate({ 
          from: "USD", 
          to: detectedCurrencyOption.code 
        }));
        
        console.log(`Setting currency based on location: ${detectedCurrencyOption.code} (${country})`);
      } else {
        // If detected currency is not available, fall back to default from config
        console.log(`Detected currency ${detectedCurrency} not available, using default`);
        setDefaultCurrencyFromConfig();
      }
    }
  }, [detected, detectedCurrency, config, dispatch, country]);

  // Set default currency from config as a fallback
  const setDefaultCurrencyFromConfig = () => {
    if (config?.currencies?.default) {
      const defaultCurrency = config.currencies.options.find(
        (c) => c.code === config.currencies?.default
      );

      if (defaultCurrency) {
        dispatch(
          setCurrency({
            code: defaultCurrency.code,
            symbol: defaultCurrency.symbol,
          })
        );
      }
    }
  };

  useEffect(() => {
    // Only set default if we haven't detected a currency yet
    if (!detected && config?.currencies?.default) {
      setDefaultCurrencyFromConfig();
    }
  }, [config, dispatch, detected]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleCurrencyDropdown = () =>
    setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);

  // Helper function to use Google Translate
  const translateWithGoogleTranslate = (langCode: string) => {
    const googleLangCode = googleTranslateLanguageMap[langCode.toUpperCase()];
    if (googleLangCode) {
      // Access the translatePage function defined in index.html
      const win = window as ExtendedWindow;
      if (win.translatePage) {
        win.translatePage(googleLangCode);
        console.log('Triggered translation to', googleLangCode);
      } else {
        console.error('window.translatePage function not found');
      }
    } else {
      console.warn(`No mapping found for language code: ${langCode}`);
    }
  };

  const handleLanguageChange = (langCode: string) => {
    const lang = langCode.toLowerCase() as "en" | "es" | "fr" | "de" | "it";
    
    // Update Redux state
    dispatch(setLanguageAction(lang as Language));
    
    // Use Google Translate for actual translation
    translateWithGoogleTranslate(langCode);
    
    // Close dropdowns
    setIsDropdownOpen(false);
    setIsMobileLanguageOpen(false);
    setIsMobileMenuOpen(false);
    
    // Log the language change for debugging
    console.log(`Language changed to: ${lang}`);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = config?.currencies?.options.find(
      (c) => c.code === currencyCode
    );

    if (selectedCurrency) {
      // First update the currency in the state
      dispatch(
        setCurrency({
          code: selectedCurrency.code,
          symbol: selectedCurrency.symbol,
        })
      );
      
      // Always fetch the conversion rate from the API, even for USD
      dispatch(fetchCurrencyRate({ 
        from: "USD", 
        to: selectedCurrency.code 
      }));
    }

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

  // Filter active languages and currencies
  const activeLanguages =
    config?.languages?.options.filter((lang) => lang.active) || [];
  const activeCurrencies =
    config?.currencies?.options.filter((curr) => curr.active) || [];

  return (
    <header className="text-white flex justify-between items-center text-center fixed h-[5.25rem] w-screen lg:pl-[5.3125rem] lg:pr-[5.3125rem] md:p-2 pl-4 pr-4 z-50 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-1">
        <img
          src={config?.header_logo?.url}
          alt={config?.header_logo?.alt || "Logo"}
          className="w-[6.44rem] h-[2.3rem] cursor-pointer mt-1"
          onClick={() => navigate(`/${currentTenantId}`)}
        />
        <span className="text-[#26266D] font-lato font-bold text-[1.25rem] tracking-[0px] md:ml-[0.3125rem] md:mt-0 h-[1.625rem]">
          {config?.page_title?.text || intl.formatMessage({ id: "text" })}
        </span>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-[#130739] p-2"
        onClick={toggleMobileMenu}
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            d={
              isMobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          ></path>
        </svg>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-8 items-center">
        <a
          href={`/${currentTenantId}/my-bookings`}
          className="text-sm text-[#130739] hover:text-gray-300 font-bold"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${currentTenantId}/my-bookings`);
          }}
        >
          MY BOOKINGS
        </a>
        {/* Language Dropdown - Only show if there are active languages */}
        {activeLanguages.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-[#130739] py-2 px-4 rounded-md"
            >
              <img src={FiGlobe} alt="Language" className="w-4 h-4 mr-1" />
              <span>{intl.formatMessage({ id: "language" })}</span>
            </button>
            {isDropdownOpen && (
              <ul className="absolute bg-white text-black rounded shadow-lg mt-2 w-32 p-2">
                {activeLanguages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => handleLanguageChange(lang.code)}
                      className="block py-1 px-3 hover:bg-gray-100 w-full text-left"
                    >
                      {lang.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Currency Dropdown - Only show if there are active currencies */}
        {activeCurrencies.length > 0 && (
          <div ref={currencyDropdownRef}>
            <button
              className="text-[#130739] text-sm flex items-center cursor-pointer"
              onClick={toggleCurrencyDropdown}
            >
              <span className="mr-1">{currency.symbol}</span>
              {currency.code}
            </button>
            {isCurrencyDropdownOpen && (
              <ul className="absolute bg-white text-black rounded shadow-lg mt-2 w-24">
                {activeCurrencies.map((curr) => (
                  <li key={curr.code}>
                    <button
                      onClick={() => handleCurrencyChange(curr.code)}
                      className="block py-1 px-3 hover:bg-gray-100 w-full text-left"
                    >
                      {curr.code}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button className="bg-[#26266d] py-2 px-4 rounded-md text-white text-sm w-[5.3125rem] h-[2.1875rem]">
          LOGIN
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden w-full">
          <nav className="flex flex-col p-4 space-y-4">
            <a
              href={`/${currentTenantId}/my-bookings`}
              className="text-base sm:text-lg text-[#130739] py-2 border-b border-gray-200"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${currentTenantId}/my-bookings`);
                setIsMobileMenuOpen(false);
              }}
            >
              MY BOOKINGS
            </a>

            {/* Language Selection - Only show if there are active languages */}
            {activeLanguages.length > 0 && (
              <div className="py-2 border-b border-gray-200">
                <button
                  onClick={() => setIsMobileLanguageOpen(!isMobileLanguageOpen)}
                  className="flex items-center text-[#130739] w-full text-base sm:text-lg"
                >
                  <img src={FiGlobe} alt="Language" className="w-4 h-4 mr-2" />
                  <span>{intl.formatMessage({ id: "language" })}</span>
                </button>
                {isMobileLanguageOpen && (
                  <div className="mt-2 pl-4 space-y-2 text-black">
                    {activeLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="text-sm sm:text-base block py-1.5 w-full text-left"
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Currency Selection - Only show if there are active currencies */}
            {activeCurrencies.length > 0 && (
              <div className="py-2 border-b border-gray-200">
                <button
                  onClick={() => setIsMobileCurrencyOpen(!isMobileCurrencyOpen)}
                  className="flex items-center text-[#130739] w-full"
                >
                  <span className="mr-1">{currency.symbol}</span>
                  {currency.code}
                </button>
                {isMobileCurrencyOpen && (
                  <div className="mt-2 pl-6">
                    {activeCurrencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        className="block py-2 text-[#130739] w-full text-left"
                      >
                        {curr.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Login Button */}
            <button className="bg-[#26266d] py-2.5 px-4 rounded-md text-white text-base sm:text-lg mt-2">
              LOGIN
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

// Define the interface for the extended window with Google Translate properties
interface ExtendedWindow extends Window {
  translatePage?: (langCode: string) => void;
  googleTranslateReady?: boolean;
  pendingLanguageCode?: string | null;
  googleTranslateElement?: object;
  _translationObserver?: MutationObserver;
  google?: {
    translate: {
      TranslateElement: {
        new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: string | { [key: string]: string };
            autoDisplay?: boolean;
          }, 
          element: string
        ): object;
        InlineLayout: {
          SIMPLE: string;
        };
        getInstance(): object;
      };
    };
  };
}

// Give the wrapped component a name for Fast Refresh
export default Header;
