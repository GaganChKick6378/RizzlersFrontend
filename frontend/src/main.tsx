import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

import enMessages from './locales/en.json';
import esMessages from './locales/es.json';
import frMessages from './locales/fr.json';
import deMessages from './locales/de.json';
import itMessages from './locales/it.json';

import * as Sentry from '@sentry/react';
import "./utils/sentry"

const messages = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages
};

const AppWrapper = () => {
  const [locale, setLocale] = useState<'en' | 'es' | 'fr' | 'de' | 'it'>('en'); 

  const changeLanguage = (language: 'en' | 'es' | 'fr' | 'de' | 'it') => {
    setLocale(language);
  };

  return (
    <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Provider store={store}>
        <App changeLanguage={changeLanguage} />
      </Provider>
    </IntlProvider>
    </Sentry.ErrorBoundary>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<AppWrapper />);
