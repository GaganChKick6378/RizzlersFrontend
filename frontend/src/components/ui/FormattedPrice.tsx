import React from 'react';
import { formatCurrencyValue } from '../../lib/currencyUtils';

interface FormattedPriceProps {
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  className?: string;
}

/**
 * A reusable component for displaying prices with currency-specific formatting
 * Uses K format (1K, 1.3K) for INR when values are in thousands
 */
export const FormattedPrice: React.FC<FormattedPriceProps> = ({
  amount,
  currencyCode,
  currencySymbol,
  className = ''
}) => {
  const formattedValue = formatCurrencyValue(amount, currencyCode, currencySymbol);
  
  return (
    <span className={className}>{formattedValue}</span>
  );
};

export default FormattedPrice; 