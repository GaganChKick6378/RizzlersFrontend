import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "./components/Footer";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import "./utils/sentry";

import { IntlProvider } from "react-intl";
import { RootState } from "./redux/store";
import { Language } from "@/enums/language.enum";

import enMessages from "./locales/en.json";
import esMessages from "./locales/es.json";
import frMessages from "./locales/fr.json";
import deMessages from "./locales/de.json";
import itMessages from "./locales/it.json";
import WrappedHeader from "./components/Header";
import Room from "./pages/rooms/Room";

interface MessageFormat {
  language: string;
  text: string;
  noBooking: string;
  [key: string]: string;
}

const messages: Record<string, MessageFormat> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages,
};

export const AppContent = () => {
  const language = useSelector((state: RootState) => state.header.language);

  let locale: string;

  switch (language) {
    case Language.English:
      locale = "en";
      break;
    case Language.Spanish:
      locale = "es";
      break;
    case Language.French:
      locale = "fr";
      break;
    case Language.German:
      locale = "de";
      break;
    case Language.Italian:
      locale = "it";
      break;
    default:
      locale = "en";
  }

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Router>
        <div className="flex flex-col h-screen lg:h-full">
          <WrappedHeader />
          <div className="flex-grow">
            <Routes>
              {/* Redirect from root to default tenant ID (1) */}
              <Route path="/" element={<Navigate to="/1" replace />} />

              {/* Routes with tenant ID parameter */}
              <Route path="/:tenantId" element={<Home />} />
              <Route path="/:tenantId/my-bookings" element={<MyBookings />} />
              <Route path="/:tenantId/:propertyId/rooms" element={<Room />} />
              {/* Legacy route for compatibility */}
              <Route
                path="/my-bookings"
                element={<Navigate to="/1/my-bookings" replace />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </IntlProvider>
  );
};
