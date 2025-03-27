import { FooterConfig, LandingConfig } from '@/interfaces/landingConfig.interface';

// Default values for the landing page configuration
export const defaultLandingConfig: LandingConfig = {
  tenantId: 1,
  page: "landing",
  header_logo: {
    alt: "Resort Logo",
    url: ""
  },
  page_title: {
    text: "Internet Booking Engine"
  },
  banner_image: {
    alt: "Beach Resort",
    url: ""
  },
  footer: {
    desc: "All rights reserved.",
    image: {
      alt: "Kickdrum",
      url: ""
    },
    copyright: "© Kickdrum Technology Group LLC."
  },
  languages: {
    default: "EN",
    options: [
      {
        code: "EN",
        name: "English",
        active: true
      },
      {
        code: "ES",
        name: "Español",
        active: true
      },
      {
        code: "FR",
        name: "Français",
        active: true
      },
      {
        code: "DE",
        name: "Deutsch",
        active: true
      },
      {
        code: "IT",
        name: "Italiano",
        active: true
      }
    ]
  },
  currencies: {
    default: "USD",
    options: [
      {
        code: "USD",
        name: "US Dollar",
        active: true,
        symbol: "$"
      },
      {
        code: "EUR",
        name: "Euro",
        active: true,
        symbol: "€"
      },
      {
        code: "GBP",
        name: "British Pound",
        active: true,
        symbol: "£"
      },
      {
        code: "INR",
        name: "Indian Rupee",
        active: true,
        symbol: "₹"
      }
    ]
  },
  length_of_stay: {
    max: 30,
    min: 1,
    default: 3
  },
  guest_options: {
    show: true,
    use_guest_type_definitions: true
  },
  room_options: {
    show: true,
    max_rooms: 3
  },
  accessibility_options: {
    show: true,
    options: ["wheelchair"]
  },
  number_of_rooms: {
    max: 5,
    min: 1,
    value: 1
  },
  guest_types: [
    {
      id: 1,
      description: "Adults (18+)",
      isActive: true,
      maxCount: 4,
      guestType: "Adults",
      minAge: 18,
      maxAge: 999
    }
  ],
  properties: []
};

/**
 * Apply default values to landing configuration data from the API
 * This ensures that all required fields have values even if the API returns incomplete data
 */
export const applyLandingConfigDefaults = (apiConfig: Partial<LandingConfig> | null): LandingConfig => {
  if (!apiConfig) {
    return { ...defaultLandingConfig };
  }
  
  // Create a new object with defaults, then override with API values
  const result: LandingConfig = {
    ...defaultLandingConfig,
    ...apiConfig,
    // Handle nested objects
    header_logo: {
      ...defaultLandingConfig.header_logo,
      alt: apiConfig.header_logo?.alt || defaultLandingConfig.header_logo.alt,
      url: apiConfig.header_logo?.url || defaultLandingConfig.header_logo.url
    },
    page_title: {
      ...defaultLandingConfig.page_title,
      text: apiConfig.page_title?.text || defaultLandingConfig.page_title.text
    },
    banner_image: {
      ...defaultLandingConfig.banner_image,
      alt: apiConfig.banner_image?.alt || defaultLandingConfig.banner_image.alt,
      url: apiConfig.banner_image?.url || defaultLandingConfig.banner_image.url
    },
    footer: {
      ...defaultLandingConfig.footer,
      desc: apiConfig.footer?.desc || defaultLandingConfig.footer.desc,
      copyright: apiConfig.footer?.copyright || defaultLandingConfig.footer.copyright,
      image: {
        alt: apiConfig.footer?.image?.alt || defaultLandingConfig.footer.image.alt,
        url: apiConfig.footer?.image?.url || defaultLandingConfig.footer.image.url
      }
    } as FooterConfig,
    languages: {
      default: apiConfig.languages?.default || defaultLandingConfig.languages.default,
      options: apiConfig.languages?.options?.length 
        ? apiConfig.languages.options 
        : defaultLandingConfig.languages.options
    },
    currencies: {
      default: apiConfig.currencies?.default || defaultLandingConfig.currencies.default,
      options: apiConfig.currencies?.options?.length 
        ? apiConfig.currencies.options 
        : defaultLandingConfig.currencies.options
    },
    length_of_stay: {
      ...defaultLandingConfig.length_of_stay,
      max: apiConfig.length_of_stay?.max || defaultLandingConfig.length_of_stay.max,
      min: apiConfig.length_of_stay?.min || defaultLandingConfig.length_of_stay.min,
      default: apiConfig.length_of_stay?.default || defaultLandingConfig.length_of_stay.default
    },
    guest_options: {
      ...defaultLandingConfig.guest_options,
      show: apiConfig.guest_options?.show !== undefined ? apiConfig.guest_options.show : defaultLandingConfig.guest_options.show,
      use_guest_type_definitions: apiConfig.guest_options?.use_guest_type_definitions !== undefined ? 
        apiConfig.guest_options.use_guest_type_definitions : defaultLandingConfig.guest_options.use_guest_type_definitions
    },
    room_options: {
      ...defaultLandingConfig.room_options,
      show: apiConfig.room_options?.show !== undefined ? apiConfig.room_options.show : defaultLandingConfig.room_options.show,
      max_rooms: apiConfig.room_options?.max_rooms || defaultLandingConfig.room_options.max_rooms
    },
    accessibility_options: {
      ...defaultLandingConfig.accessibility_options,
      show: apiConfig.accessibility_options?.show !== undefined ? 
        apiConfig.accessibility_options.show : defaultLandingConfig.accessibility_options.show,
      options: apiConfig.accessibility_options?.options?.length ? 
        apiConfig.accessibility_options.options : defaultLandingConfig.accessibility_options.options
    },
    number_of_rooms: {
      ...defaultLandingConfig.number_of_rooms,
      max: apiConfig.number_of_rooms?.max || defaultLandingConfig.number_of_rooms.max,
      min: apiConfig.number_of_rooms?.min || defaultLandingConfig.number_of_rooms.min,
      value: apiConfig.number_of_rooms?.value || defaultLandingConfig.number_of_rooms.value
    },
    // For arrays, prefer API values if they exist, otherwise use defaults
    guest_types: apiConfig.guest_types?.length ? apiConfig.guest_types : defaultLandingConfig.guest_types,
    properties: apiConfig.properties?.length ? apiConfig.properties : defaultLandingConfig.properties
  };
  
  return result;
}; 