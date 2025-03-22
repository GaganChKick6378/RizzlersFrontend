import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import "./utils/sentry";
import { fetchLandingConfig } from "./redux/slices/landingConfigSlice";

import { IntlProvider } from "react-intl";
import { RootState } from "./redux/store";
import { Language } from "@/enums/language.enum";

import enMessages from "./locales/en.json";
import esMessages from "./locales/es.json";
import frMessages from "./locales/fr.json";
import deMessages from "./locales/de.json";
import itMessages from "./locales/it.json";

interface MessageFormat {
  language: string;
  text: string;
  noBooking: string;
  [key: string]: string
}

const messages: Record<string, MessageFormat> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages
};

export const AppContent = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.header.language);
  
  useEffect(() => {
    dispatch(fetchLandingConfig(1)); // Fetch config for tenant ID 1 when app loads
  }, [dispatch]);

  let locale: string;
  
  switch (language) {
    case Language.English:
      locale = 'en';
      break;
    case Language.Spanish:
      locale = 'es';
      break;
    case Language.French:
      locale = 'fr';
      break;
    case Language.German:
      locale = 'de';
      break;
    case Language.Italian:
      locale = 'it';
      break;
    default:
      locale = 'en'; 
  }
  
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Router>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </IntlProvider>
  );
};