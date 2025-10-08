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
