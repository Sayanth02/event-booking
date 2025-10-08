/**
 * Central export point for all services
 * Import services from here for cleaner imports
 * 
 * Example:
 * import { eventsService, videoAddonsService, albumConfigService, complimentaryItemsService } from '@/services';
 */

export { eventsService, EventsService } from './events.service';
export { videoAddonsService, VideoAddonsService } from './videoAddons.service';
export { albumConfigService, AlbumConfigService } from './albumConfig.service';
export { complimentaryItemsService, ComplimentaryItemsService } from './complimentaryItems.service';
export { pricingConfigService, PricingConfigService } from './pricingConfig.service';
export { pricingService, PricingService } from './pricing.service';
export { bookingService, BookingService } from './booking.service';

// Export types
export type { 
  Event,
  EventInput,
  EventCategory,
  EventFunction, 
  SelectedFunction,
  VideoAddon,
  VideoAddonInput,
  VideoAddonOption,
  AlbumConfigDB,
  AlbumConfiguration,
  ComplimentaryItem,
  ComplimentaryItemOption,
  PricingConfigDB,
  PricingConfiguration,
  PricingBreakdown,
  FunctionPricing,
  AlbumPricing,
  BookingDB,
  BookingInput,
  BookingResponse,
  BookingStatus,
  PaymentStatus
} from '@/types/events';
