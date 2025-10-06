import { createClient } from '@/utlis/supabase/client';
import { Event, EventFunction, EventCategory } from '@/types/events';

/**
 * Service layer for event-related database operations
 */
export class EventsService {
  private supabase = createClient();

  /**
   * Fetch all active events from the catalog
   */
  async getAllEvents(): Promise<EventFunction[]> {
    const { data, error } = await this.supabase
      .from('event_catalog')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return this.mapToEventFunctions(data || []);
  }

  /**
   * Fetch events by category
   * @param category - 'main', 'other', or 'additional'
   */
  async getEventsByCategory(category: EventCategory): Promise<EventFunction[]> {
    const { data, error } = await this.supabase
      .from('event_catalog')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(`Error fetching ${category} events:`, error);
      throw new Error(`Failed to fetch ${category} events: ${error.message}`);
    }

    return this.mapToEventFunctions(data || []);
  }

  /**
   * Fetch main functions (wedding, engagement, etc.)
   */
  async getMainFunctions(): Promise<EventFunction[]> {
    return this.getEventsByCategory('main');
  }

  /**
   * Fetch other functions (birthday, anniversary, etc.)
   */
  async getOtherFunctions(): Promise<EventFunction[]> {
    return this.getEventsByCategory('other');
  }

  /**
   * Fetch additional functions (haldi, mehendi, etc.)
   */
  async getAdditionalFunctions(): Promise<EventFunction[]> {
    return this.getEventsByCategory('additional');
  }

  /**
   * Fetch a single event by ID
   */
  async getEventById(id: string): Promise<EventFunction | null> {
    const { data, error } = await this.supabase
      .from('event_catalog')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching event ${id}:`, error);
      return null;
    }

    return data ? this.mapToEventFunction(data) : null;
  }

  /**
   * Map database records to frontend EventFunction type
   */
  private mapToEventFunctions(records: Event[]): EventFunction[] {
    return records.map(this.mapToEventFunction);
  }

  /**
   * Map a single database record to EventFunction
   */
  private mapToEventFunction(record: Event): EventFunction {
    return {
      id: record.id,
      label: record.label,
      icon: record.icon,
      defaultHours: record.included_hours,
      flatPrice: record.flat_price,
      includedPhotographers: record.included_photographers,
      includedCinematographers: record.included_cinematographers,
    };
  }
}

// Export a singleton instance
export const eventsService = new EventsService();
