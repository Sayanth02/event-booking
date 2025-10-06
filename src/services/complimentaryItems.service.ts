import { createClient } from '@/utlis/supabase/client';
import { ComplimentaryItem, ComplimentaryItemOption } from '@/types/events';

/**
 * Service layer for complimentary items database operations
 */
export class ComplimentaryItemsService {
  private supabase = createClient();

  /**
   * Fetch all active complimentary items
   */
  async getAllComplimentaryItems(): Promise<ComplimentaryItemOption[]> {
    const { data, error } = await this.supabase
      .from('complimentary_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching complimentary items:', error);
      throw new Error(`Failed to fetch complimentary items: ${error.message}`);
    }

    return this.mapToComplimentaryItemOptions(data || []);
  }

  /**
   * Fetch a single complimentary item by ID
   */
  async getComplimentaryItemById(id: string): Promise<ComplimentaryItemOption | null> {
    const { data, error } = await this.supabase
      .from('complimentary_items')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching complimentary item ${id}:`, error);
      return null;
    }

    return data ? this.mapToComplimentaryItemOption(data) : null;
  }

  /**
   * Fetch a single complimentary item by slug
   */
  async getComplimentaryItemBySlug(slug: string): Promise<ComplimentaryItemOption | null> {
    const { data, error } = await this.supabase
      .from('complimentary_items')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching complimentary item ${slug}:`, error);
      return null;
    }

    return data ? this.mapToComplimentaryItemOption(data) : null;
  }

  /**
   * Map database records to frontend ComplimentaryItemOption type
   */
  private mapToComplimentaryItemOptions(records: ComplimentaryItem[]): ComplimentaryItemOption[] {
    return records.map(this.mapToComplimentaryItemOption);
  }

  /**
   * Map a single database record to ComplimentaryItemOption
   */
  private mapToComplimentaryItemOption(record: ComplimentaryItem): ComplimentaryItemOption {
    return {
      value: record.slug,
      label: record.label,
      description: record.description || '',
      icon: record.icon || 'Gift',
    };
  }
}

// Export a singleton instance
export const complimentaryItemsService = new ComplimentaryItemsService();
