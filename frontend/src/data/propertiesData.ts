import { PropertyData, PropertiesData } from "@/interfaces/propertyRate.interface";
import { landingConfigData } from './landingConfig';

// Helper function to generate dummy rates
const generateDummyRates = (startDate: Date, numDays: number, baseRate: number) => {
  const rates = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const minimum_rate = isWeekend ? baseRate * 2 : baseRate;
    const has_promotion = Math.random() > 0.8;
    const price_factor = has_promotion ? 0.2 : 0;
    rates.push({
      date: date.toISOString().split('T')[0],
      minimum_rate,
      has_promotion,
      price_factor,
      discounted_rate: minimum_rate * (1 - price_factor)
    });
  }
  return rates;
};

// Get properties from landing config
const configProperties = landingConfigData[1].properties;

// Create properties data with rates
export const propertiesData: PropertiesData = {
  "property1": {
    propertyId: 1,
    property_name: configProperties[0].property_name,
    rates: Array.from({ length: 122 }).map((_, i) => { // 122 days from Mar 1 to Jun 30
      const date = new Date(2025, 2, 1); // March 1, 2025
      date.setDate(date.getDate() + i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const base_rate = isWeekend ? 150.0 : 120.0;
      const has_promotion = Math.random() > 0.7; // 30% chance of promotion
      const price_factor = has_promotion ? 0.2 : 0; // 20% discount when promotion is active
      return {
        date: date.toISOString().split('T')[0],
        minimum_rate: base_rate,
        has_promotion,
        price_factor,
        discounted_rate: Math.round(base_rate * (1 - price_factor))
      };
    })
  },
  "property2": {
    propertyId: 2,
    property_name: configProperties[1].property_name,
    rates: generateDummyRates(new Date(2025, 2, 1), 90, 80)
  },
  "property3": {
    propertyId: 3,
    property_name: configProperties[2].property_name,
    rates: generateDummyRates(new Date(2025, 2, 1), 90, 100)
  }
};

export type { PropertyData };
