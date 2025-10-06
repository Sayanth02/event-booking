import { createClient } from '@/utlis/supabase/client';
import { VideoAddon, VideoAddonOption } from '@/types/events';

/**
 * Service layer for video addon-related database operations
 */
export class VideoAddonsService {
  private supabase = createClient();

  /**
   * Fetch all active video addons
   */
  async getAllVideoAddons(): Promise<VideoAddonOption[]> {
    const { data, error } = await this.supabase
      .from('video_addons')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching video addons:', error);
      throw new Error(`Failed to fetch video addons: ${error.message}`);
    }

    return this.mapToVideoAddonOptions(data || []);
  }

  /**
   * Fetch a single video addon by ID
   */
  async getVideoAddonById(id: string): Promise<VideoAddonOption | null> {
    const { data, error } = await this.supabase
      .from('video_addons')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching video addon ${id}:`, error);
      return null;
    }

    return data ? this.mapToVideoAddonOption(data) : null;
  }

  /**
   * Fetch a single video addon by slug
   */
  async getVideoAddonBySlug(slug: string): Promise<VideoAddonOption | null> {
    const { data, error } = await this.supabase
      .from('video_addons')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching video addon ${slug}:`, error);
      return null;
    }

    return data ? this.mapToVideoAddonOption(data) : null;
  }

  /**
   * Map database records to frontend VideoAddonOption type
   */
  private mapToVideoAddonOptions(records: VideoAddon[]): VideoAddonOption[] {
    return records.map(this.mapToVideoAddonOption);
  }

  /**
   * Map a single database record to VideoAddonOption
   */
  private mapToVideoAddonOption(record: VideoAddon): VideoAddonOption {
    return {
      value: record.slug,
      label: record.label,
      description: record.description || '',
      price: record.price,
    };
  }
}

// Export a singleton instance
export const videoAddonsService = new VideoAddonsService();
