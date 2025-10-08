import { 
  PricingBreakdown, 
  FunctionPricing, 
  AlbumPricing,
  EventFunction,
  AlbumConfiguration,
  PricingConfiguration,
  VideoAddonOption
} from '@/types/events';
import { SelectedFunction, AlbumConfig } from '@/lib/store';

/**
 * Service for calculating pricing based on user selections
 */
export class PricingService {
  
  /**
   * Calculate complete pricing breakdown
   */
  calculatePricing(
    selectedFunctions: SelectedFunction[],
    additionalFunctions: SelectedFunction[],
    albumConfig: AlbumConfig,
    videoAddons: string[],
    eventFunctions: EventFunction[],
    albumConfiguration: AlbumConfiguration,
    pricingConfig: PricingConfiguration,
    videoAddonOptions: VideoAddonOption[]
  ): PricingBreakdown {
    
    // Calculate all selected functions (main + additional)
    const allSelectedFunctions = [...selectedFunctions, ...additionalFunctions];
    const functionsPricing = this.calculateFunctionsPricing(
      allSelectedFunctions,
      eventFunctions,
      pricingConfig
    );

    // Calculate album pricing
    const albumPricing = this.calculateAlbumPricing(
      albumConfig,
      albumConfiguration
    );

    // Calculate video addons pricing
    const videoAddonsPricing = this.calculateVideoAddonsPricing(
      videoAddons,
      videoAddonOptions
    );

    // Calculate totals
    const functionsTotal = functionsPricing.reduce((sum, f) => sum + f.totalFunctionCost, 0);
    const videoAddonsTotal = videoAddonsPricing.reduce((sum, v) => sum + v.price, 0);
    
    const subtotal = functionsTotal + albumPricing.totalAlbumCost + videoAddonsTotal;
    const tax = Math.round(subtotal * (pricingConfig.taxPercentage / 100));
    const total = subtotal + tax;
    const advance = Math.round(total * (pricingConfig.advancePercentage / 100));
    const balance = total - advance;

    return {
      functions: functionsPricing,
      album: albumPricing,
      videoAddons: videoAddonsPricing,
      subtotal,
      tax,
      total,
      advance,
      balance,
    };
  }

  /**
   * Calculate pricing for all selected functions
   */
  private calculateFunctionsPricing(
    selectedFunctions: SelectedFunction[],
    eventFunctions: EventFunction[],
    pricingConfig: PricingConfiguration
  ): FunctionPricing[] {
    return selectedFunctions.map(selectedFunc => {
      const eventFunc = eventFunctions.find(ef => ef.id === selectedFunc.functionId);
      
      if (!eventFunc) {
        // If event function not found, return zero pricing
        return {
          functionId: selectedFunc.functionId,
          functionName: selectedFunc.name,
          basePrice: 0,
          extraHoursCost: 0,
          extraCrewCost: 0,
          totalFunctionCost: 0,
          details: {
            duration: selectedFunc.duration,
            includedHours: 0,
            extraHours: 0,
            photographers: selectedFunc.photographers,
            includedPhotographers: 0,
            cinematographers: selectedFunc.cinematographers,
            includedCinematographers: 0,
            extraCrewCount: 0,
          },
        };
      }

      // Calculate extra hours
      const extraHours = Math.max(0, selectedFunc.duration - eventFunc.defaultHours);
      const extraHoursCost = Math.round(extraHours * eventFunc.extraHourRate);

      // Calculate extra crew
      const extraPhotographers = Math.max(0, selectedFunc.photographers - eventFunc.includedPhotographers);
      const extraCinematographers = Math.max(0, selectedFunc.cinematographers - eventFunc.includedCinematographers);
      const extraCrewCount = extraPhotographers + extraCinematographers;
      const extraCrewCost = extraCrewCount * pricingConfig.extraCrewFlatFee;

      // Total for this function
      const totalFunctionCost = eventFunc.flatPrice + extraHoursCost + extraCrewCost;

      return {
        functionId: selectedFunc.functionId,
        functionName: selectedFunc.name,
        basePrice: eventFunc.flatPrice,
        extraHoursCost,
        extraCrewCost,
        totalFunctionCost,
        details: {
          duration: selectedFunc.duration,
          includedHours: eventFunc.defaultHours,
          extraHours,
          photographers: selectedFunc.photographers,
          includedPhotographers: eventFunc.includedPhotographers,
          cinematographers: selectedFunc.cinematographers,
          includedCinematographers: eventFunc.includedCinematographers,
          extraCrewCount,
        },
      };
    });
  }

  /**
   * Calculate album pricing
   */
  private calculateAlbumPricing(
    albumConfig: AlbumConfig,
    albumConfiguration: AlbumConfiguration
  ): AlbumPricing {
    const { pages, type } = albumConfig;
    const { basePages, basePriceSingle, per10PagesCost, doubleAlbumMultiplier } = albumConfiguration;

    // Calculate extra pages cost
    const extraPages = Math.max(0, pages - basePages);
    const extraPagesCost = Math.round((extraPages / 10) * per10PagesCost);

    // Calculate base price + extra pages
    let totalAlbumCost = basePriceSingle + extraPagesCost;

    // Apply multiplier for double album
    const multiplier = type === 'two-photobooks' ? doubleAlbumMultiplier : 1;
    totalAlbumCost = Math.round(totalAlbumCost * multiplier);

    return {
      basePrice: basePriceSingle,
      extraPagesCost,
      totalAlbumCost,
      details: {
        pages,
        basePages,
        extraPages,
        albumType: type,
        multiplier,
      },
    };
  }

  /**
   * Calculate video addons pricing
   */
  private calculateVideoAddonsPricing(
    selectedAddons: string[],
    videoAddonOptions: VideoAddonOption[]
  ): { slug: string; label: string; price: number }[] {
    return selectedAddons
      .map(addonSlug => {
        const addon = videoAddonOptions.find(v => v.value === addonSlug);
        return addon ? {
          slug: addonSlug,
          label: addon.label,
          price: addon.price,
        } : null;
      })
      .filter((addon): addon is { slug: string; label: string; price: number } => addon !== null);
  }
}

// Export a singleton instance
export const pricingService = new PricingService();
