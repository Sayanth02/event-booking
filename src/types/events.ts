// Event category type
export type EventCategory = 'main' | 'additional' | 'other';

// Database type for events_catalog table
export interface Event {
  id: string;
  slug: string;
  label: string;
  category: EventCategory;
  icon: string;
  flat_price: number;
  included_hours: number;
  included_photographers: number;
  included_cinematographers: number;
  extra_hour_rate: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Input type for creating/updating events
export interface EventInput {
  slug: string;
  label: string;
  category: EventCategory;
  icon?: string;
  flat_price: number;
  included_hours: number;
  included_photographers: number;
  included_cinematographers: number;
  is_active?: boolean;
  sort_order?: number;
}

// Frontend function type (used in components)
export interface EventFunction {
  id: string;
  label: string;
  icon: string;
  defaultHours: number;
  flatPrice: number;
  includedPhotographers: number;
  includedCinematographers: number;
  extraHourRate: number;
}

// Selected function in store
export interface SelectedFunction {
  id: string;
  functionId: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  photographers: number;
  cinematographers: number;
}

// ==================== Video Addons ====================

// Database type for video_addons table
export interface VideoAddon {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Input type for creating/updating video addons
export interface VideoAddonInput {
  slug: string;
  label: string;
  description?: string;
  price: number;
  is_active?: boolean;
  sort_order?: number;
}

// Frontend video addon type (used in components)
export interface VideoAddonOption {
  value: string;
  label: string;
  description: string;
  price: number;
}

// ==================== Album Configuration ====================

// Database type for album_config table
export interface AlbumConfigDB {
  id: string;
  config_key: string;
  config_value: number | null;
  config_type: 'number' | 'text' | 'boolean';
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// Frontend album configuration type
export interface AlbumConfiguration {
  basePages: number;
  basePriceSingle: number;
  per10PagesCost: number;
  doubleAlbumMultiplier: number;
  pagesIncrement: number;
}

// ==================== Complimentary Items ====================

// Database type for complimentary_items table
export interface ComplimentaryItem {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// Frontend complimentary item type (used in components)
export interface ComplimentaryItemOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

// ==================== Pricing Configuration ====================

// Database type for pricing_config table
export interface PricingConfigDB {
  config_key: string;
  config_value: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Frontend pricing configuration type
export interface PricingConfiguration {
  extraCrewFlatFee: number;
  taxPercentage: number;
  advancePercentage: number;
}

// ==================== Pricing Breakdown ====================

// Individual function pricing breakdown
export interface FunctionPricing {
  functionId: string;
  functionName: string;
  basePrice: number;
  extraHoursCost: number;
  extraCrewCost: number;
  totalFunctionCost: number;
  details: {
    duration: number;
    includedHours: number;
    extraHours: number;
    photographers: number;
    includedPhotographers: number;
    cinematographers: number;
    includedCinematographers: number;
    extraCrewCount: number;
  };
}

// Album pricing breakdown
export interface AlbumPricing {
  basePrice: number;
  extraPagesCost: number;
  totalAlbumCost: number;
  details: {
    pages: number;
    basePages: number;
    extraPages: number;
    albumType: string;
    multiplier: number;
  };
}

// Overall pricing breakdown
export interface PricingBreakdown {
  functions: FunctionPricing[];
  album: AlbumPricing;
  videoAddons: {
    slug: string;
    label: string;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  advance: number;
  balance: number;
}

// ==================== Bookings ====================

// Booking status types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'advance_paid' | 'fully_paid' | 'refunded';

// Database type for bookings table
export interface BookingDB {
  id: string;
  booking_reference: string;
  
  // Client Information
  client_name: string;
  client_phone: string;
  client_whatsapp: string | null;
  client_email: string | null;
  client_home_address: string | null;
  client_current_location: string | null;
  
  // Event Details
  booking_type: string;
  event_location: string;
  event_date: string;
  guest_count: string | null;
  budget_range: string | null;
  
  // Selected Functions
  selected_functions: SelectedFunction[];
  additional_functions: SelectedFunction[];
  
  // Crew Information
  total_photographers: number;
  total_cinematographers: number;
  main_event_start_time: string | null;
  main_event_end_time: string | null;
  
  // Album Configuration
  album_type: string;
  album_pages: number;
  
  // Add-ons
  video_addons: string[];
  complimentary_item: string | null;
  
  // Package & Pricing
  selected_package: string | null;
  selected_package_id: string | null;
  total_price: number;
  advance_amount: number;
  balance_amount: number;
  pricing_breakdown: PricingBreakdown | null;
  
  // Status
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  
  // Terms & Signature
  digital_signature: string;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // PDF
  pdf_generated: boolean;
  pdf_url: string | null;
  pdf_generated_at: string | null;
}

// Input type for creating a booking
export interface BookingInput {
  // Client Information
  client_name: string;
  client_phone: string;
  client_whatsapp?: string;
  client_email?: string;
  client_home_address?: string;
  client_current_location?: string;
  
  // Event Details
  booking_type: string;
  event_location: string;
  event_date: string;
  guest_count?: string;
  budget_range?: string;
  
  // Selected Functions
  selected_functions: SelectedFunction[];
  additional_functions: SelectedFunction[];
  
  // Crew Information
  total_photographers: number;
  total_cinematographers: number;
  main_event_start_time?: string;
  main_event_end_time?: string;
  
  // Album Configuration
  album_type: string;
  album_pages: number;
  
  // Add-ons
  video_addons: string[];
  complimentary_item?: string;
  
  // Package & Pricing
  selected_package?: string;
  selected_package_id?: string;
  total_price: number;
  advance_amount: number;
  balance_amount: number;
  pricing_breakdown?: PricingBreakdown;
  
  // Terms & Signature
  digital_signature: string;
  terms_accepted: boolean;
}

// Booking response type
export interface BookingResponse {
  success: boolean;
  booking?: BookingDB;
  bookingReference?: string;
  error?: string;
}
