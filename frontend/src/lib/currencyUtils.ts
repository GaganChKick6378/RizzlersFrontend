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

/**
 * Formats currency value with appropriate formatting based on currency and amount
 * For INR (Rupees), format thousands as K format (e.g., 1K, 1.3K)
 * 
 * @param amount The amount to format
 * @param currencyCode The currency code (e.g., 'INR', 'USD')
 * @param currencySymbol The currency symbol (e.g., '₹', '$')
 * @returns Formatted currency string
 */
export const formatCurrencyValue = (
  amount: number, 
  currencyCode: string, 
  currencySymbol: string
): string => {
  // For INR and amounts >= 1000, use K format
  if (currencyCode === 'INR' && amount >= 1000) {
    // Format to one decimal place if not a whole number of thousands
    const inK = amount / 1000;
    const formatted = inK % 1 !== 0 
      ? inK.toFixed(1).replace(/\.0$/, '') // Remove .0 if it ends with it
      : inK.toString();
    
    return `${currencySymbol}${formatted}K`;
  }
  
  // For other currencies or smaller amounts, use standard formatting
  return `${currencySymbol}${amount.toFixed(2).replace(/\.00$/, '')}`;
};
