import { LandingConfig } from '@/interfaces/landingConfig.interface';

// Fallback data in case the API fails
export const fallbackLandingConfig: LandingConfig = {
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
    desc: "Welcome to our resort",
    image: {
      alt: "Footer Logo",
      url: ""
    },
    copyright: "© 2023 Resort. All rights reserved."
  },
  languages: {
    default: "en",
    options: [
      {
        code: "en",
        name: "English",
        active: true
      },
      {
        code: "es",
        name: "Spanish",
        active: false
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
        active: false,
        symbol: "€"
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
    options: ["wheelchair", "hearing", "visual"]
  },
  number_of_rooms: {
    max: 5,
    min: 1,
    value: 3
  },
  guest_types: [
    {
      id: 1,
      description: "Adults (18+)",
      isActive: true,
      maxCount: 4,
      guestType: "adult", 
      minAge: 18,
      maxAge: 999
    }
  ],
  properties: []
};
