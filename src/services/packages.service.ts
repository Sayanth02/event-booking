import { createClient } from '@/utlis/supabase/client';
import { PackageDB, Package } from '@/types/packages';

/**
 * Service layer for packages database operations
 */
export class PackagesService {
  private supabase = createClient();

  /**
   * Fetch all packages ordered by display_order
   */
  async getAllPackages(): Promise<Package[]> {
    const { data, error } = await this.supabase
      .from('packages')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching packages:', error);
      throw new Error(`Failed to fetch packages: ${error.message}`);
    }

    return this.mapToPackages(data || []);
  }

  /**
   * Fetch a single package by ID
   */
  async getPackageById(id: number): Promise<Package | null> {
    const { data, error } = await this.supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching package ${id}:`, error);
      return null;
    }

    return data ? this.mapToPackage(data) : null;
  }

  /**
   * Fetch a single package by slug
   */
  async getPackageBySlug(slug: string): Promise<Package | null> {
    const { data, error } = await this.supabase
      .from('packages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching package ${slug}:`, error);
      return null;
    }

    return data ? this.mapToPackage(data) : null;
  }

  /**
   * Map database records to frontend Package type
   */
  private mapToPackages(records: PackageDB[]): Package[] {
    return records.map(this.mapToPackage);
  }

  private mapToPackage(record: PackageDB): Package {
    // Extract features array from JSONB
    let features: string[] = [];
    if (record.features) {
      if (Array.isArray(record.features)) {
        features = record.features;
      } else if (typeof record.features === 'object' && 'items' in record.features) {
        features = (record.features as any).items || [];
      }
    }

    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      price: record.price,
      description: record.description || '',
      includedPhotographers: record.included_photographers || 0,
      includedCinematographers: record.included_cinematographers || 0,
      includedHours: record.included_hours || 0,
      includedAlbumPages: record.included_album_pages || 0,
      suitableForGuests: record.suitable_for_guests || '',
      recommended: record.is_recommended || false,
      features,
      displayOrder: record.display_order || 0,
    };
  }
}

// Export a singleton instance
export const packagesService = new PackagesService();
