export interface CurrencyConfig {
  code: string;
  symbol: string;
}

export const getCurrencyByLocale = (locale: string): CurrencyConfig => {
  // This mapping is based on common currency usage in countries
  const localeToCurrency: { [key: string]: CurrencyConfig } = {
    'en': { code: 'USD', symbol: '$' },
    'en-US': { code: 'USD', symbol: '$' },
    'en-GB': { code: 'GBP', symbol: '£' },
    'en-IN': { code: 'INR', symbol: '₹' },
    'hi': { code: 'INR', symbol: '₹' },
    'hi-IN': { code: 'INR', symbol: '₹' },
    'de': { code: 'EUR', symbol: '€' },
    'fr': { code: 'EUR', symbol: '€' },
    'es': { code: 'EUR', symbol: '€' },
    'it': { code: 'EUR', symbol: '€' },
  };

  return localeToCurrency[locale] || localeToCurrency['en'];
};

export const formatCurrency = (amount: number, currencyCode: string, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};
