import image1 from '../assets/image1.png';
import IBEBackground from '../assets/IBE_Background.jpeg';
import { LandingConfig } from '@/interfaces/landingConfig.interface';

export const landingConfigData: Record<number, LandingConfig> = {
  1: {
    tenantId: 1,
    page: "landing",
    header_logo: {
      alt: "Resort Logo",
      url: image1  // Keep using local image
    },
    page_title: {
      text: "Book Your Dream Vacation"
    },
    banner_image: {
      alt: "Beach Resort",
      url: IBEBackground  // Keep using local image
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
      options: [
        "wheelchair",
        "hearing",
        "visual"
      ]
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
      },
      {
        id: 2,
        description: "Teens (13-17)",
        isActive: true,
        maxCount: 3,
        guestType: "teen",
        minAge: 13,
        maxAge: 17
      },
      {
        id: 3,
        description: "Kids (0-12)",
        isActive: true,
        maxCount: 2,
        guestType: "kid",
        minAge: 0,
        maxAge: 12
      }
    ],
    properties: [
      {
        id: 1,
        property_id: 1,
        property_name: "Team 1 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 2,
        property_id: 2,
        property_name: "Team 2 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 3,
        property_id: 3,
        property_name: "Team 3 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 4,
        property_id: 4,
        property_name: "Team 4 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 5,
        property_id: 5,
        property_name: "Team 5 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 6,
        property_id: 6,
        property_name: "Team 6 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 7,
        property_id: 7,
        property_name: "Team 7 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 8,
        property_id: 8,
        property_name: "Team 8 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 9,
        property_id: 9,
        property_name: "Team 9 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 10,
        property_id: 10,
        property_name: "Team 10 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: true
      },
      {
        id: 11,
        property_id: 11,
        property_name: "Team 11 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 12,
        property_id: 12,
        property_name: "Team 12 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 13,
        property_id: 13,
        property_name: "Team 13 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 14,
        property_id: 14,
        property_name: "Team 14 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 15,
        property_id: 15,
        property_name: "Team 15 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 16,
        property_id: 16,
        property_name: "Team 16 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 17,
        property_id: 17,
        property_name: "Team 17 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 18,
        property_id: 18,
        property_name: "Team 18 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 19,
        property_id: 19,
        property_name: "Team 19 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 20,
        property_id: 20,
        property_name: "Team 20 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 21,
        property_id: 21,
        property_name: "Team 21 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 22,
        property_id: 22,
        property_name: "Team 22 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 23,
        property_id: 23,
        property_name: "Team 23 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      },
      {
        id: 24,
        property_id: 24,
        property_name: "Team 24 Hotel",
        property_address: "Kickdrum",
        contact_number: "123456789",
        is_assigned: false
      }
    ]
  }
};
