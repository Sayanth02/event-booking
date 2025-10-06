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
  ComplimentaryItemOption
} from '@/types/events';
