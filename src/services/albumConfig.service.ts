import { createClient } from '@/utlis/supabase/client';
import { AlbumConfigDB, AlbumConfiguration } from '@/types/events';

/**
 * Service layer for album configuration database operations
 */
export class AlbumConfigService {
  private supabase = createClient();

  /**
   * Fetch all active album configuration settings
   */
  async getAlbumConfiguration(): Promise<AlbumConfiguration> {
    const { data, error } = await this.supabase
      .from('album_config')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching album configuration:', error);
      throw new Error(`Failed to fetch album configuration: ${error.message}`);
    }

    return this.mapToAlbumConfiguration(data || []);
  }

  /**
   * Fetch a single configuration value by key
   */
  async getConfigValue(key: string): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('album_config')
      .select('config_value')
      .eq('config_key', key)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching config ${key}:`, error);
      return null;
    }

    return data?.config_value ?? null;
  }

  /**
   * Map database records to frontend AlbumConfiguration type
   */
  private mapToAlbumConfiguration(records: AlbumConfigDB[]): AlbumConfiguration {
    const configMap = new Map<string, number>();
    
    records.forEach(record => {
      if (record.config_value !== null) {
        configMap.set(record.config_key, record.config_value);
      }
    });

    return {
      basePages: configMap.get('base_pages') ?? 60,
      basePriceSingle: configMap.get('base_price_single') ?? 8000,
      per10PagesCost: configMap.get('per_10_pages_cost') ?? 500,
      doubleAlbumMultiplier: configMap.get('double_album_multiplier') ?? 1.8,
      pagesIncrement: configMap.get('pages_increment') ?? 10,
    };
  }
}

// Export a singleton instance
export const albumConfigService = new AlbumConfigService();
