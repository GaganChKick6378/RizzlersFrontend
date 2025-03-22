export interface PropertyRate {
  date: string;
  minimum_rate: number;
  has_promotion: boolean;
  price_factor: number;
  discounted_rate: number;
}

export interface PropertyData {
  propertyId: number;
  property_name: string;
  rates: PropertyRate[];
}

export interface PropertiesData {
  [key: string]: PropertyData;
}
