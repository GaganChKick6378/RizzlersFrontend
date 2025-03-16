import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MyBookings from "./pages/MyBookings";
import "./utils/sentry";

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
  studentsList: string;
  welcome: string;
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
  const language = useSelector((state: RootState) => state.header.language);
  
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
        <div className="flex-grow pt-20">
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