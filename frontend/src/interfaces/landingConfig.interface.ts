export interface GuestType {
  id: number;
  description: string;
  isActive: boolean;
  maxCount: number;
  guestType: string;
  minAge: number;
  maxAge: number;
}

export interface Property {
  id: number;
  property_id: number;
  property_name: string;
  property_address: string;
  contact_number: string;
  is_assigned: boolean;
}

export interface Language {
  code: string;
  name: string;
  active: boolean;
}

export interface Currency {
  code: string;
  name: string;
  active: boolean;
  symbol: string;
}

export interface FooterConfig {
  desc: string;
  image: {
    alt: string;
    url: string;
  };
  copyright: string;
}

export interface LandingConfig {
  tenantId: number;
  page: string;
  header_logo: {
    alt: string;
    url: string;
  };
  page_title: {
    text: string;
  };
  banner_image: {
    alt: string;
    url: string;
  };
  footer: FooterConfig;
  languages: {
    default: string;
    options: Language[];
  };
  currencies: {
    default: string;
    options: Currency[];
  };
  length_of_stay: {
    max: number;
    min: number;
    default: number;
  };
  guest_options: {
    show: boolean;
    use_guest_type_definitions: boolean;
  };
  room_options: {
    show: boolean;
    max_rooms: number;
  };
  accessibility_options: {
    show: boolean;
    options: string[];
  };
  number_of_rooms: {
    max: number;
    min: number;
    value: number;
  };
  guest_types: GuestType[];
  properties: Property[];
}
