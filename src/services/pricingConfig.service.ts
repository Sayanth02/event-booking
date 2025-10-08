import { createClient } from '@/utlis/supabase/client';
import { PricingConfigDB, PricingConfiguration } from '@/types/events';

/**
 * Service layer for pricing configuration database operations
 */
export class PricingConfigService {
  private supabase = createClient();

  /**
   * Fetch all active pricing configuration settings
   */
  async getPricingConfiguration(): Promise<PricingConfiguration> {
    const { data, error } = await this.supabase
      .from('pricing_config')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching pricing configuration:', error);
      throw new Error(`Failed to fetch pricing configuration: ${error.message}`);
    }

    return this.mapToPricingConfiguration(data || []);
  }

  /**
   * Fetch a single configuration value by key
   */
  async getConfigValue(key: string): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('pricing_config')
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
   * Map database records to frontend PricingConfiguration type
   */
  private mapToPricingConfiguration(records: PricingConfigDB[]): PricingConfiguration {
    const configMap = new Map<string, number>();
    
    records.forEach(record => {
      configMap.set(record.config_key, record.config_value);
    });

    return {
      extraCrewFlatFee: configMap.get('extra_crew_flat_fee') ?? 8000,
      taxPercentage: configMap.get('tax_percentage') ?? 0,
      advancePercentage: configMap.get('advance_percentage') ?? 30,
    };
  }
}

// Export a singleton instance
export const pricingConfigService = new PricingConfigService();
