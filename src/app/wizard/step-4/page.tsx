'use client'

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { PriceSummary } from "@/components/PriceSummary";
import { useEffect, useState } from "react";
import { 
  eventsService, 
  albumConfigService, 
  pricingConfigService,
  videoAddonsService,
  pricingService,
  EventFunction,
  AlbumConfiguration,
  PricingConfiguration,
  VideoAddonOption
} from "@/services";

export default function Step4Page() {
  const router = useRouter();
  const { 
    selectedFunctions, 
    additionalFunctions, 
    albumConfig, 
    videoAddons,
    pricingBreakdown,
    setPricingBreakdown
  } = useBookingStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculatePricing = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all required data
        const [allEventFunctions, albumConfiguration, pricingConfig, videoAddonOptions] = await Promise.all([
          eventsService.getAllEvents(),
          albumConfigService.getAlbumConfiguration(),
          pricingConfigService.getPricingConfiguration(),
          videoAddonsService.getAllVideoAddons(),
        ]);

        // Calculate pricing breakdown
        const breakdown = pricingService.calculatePricing(
          selectedFunctions,
          additionalFunctions,
          albumConfig,
          videoAddons,
          allEventFunctions,
          albumConfiguration,
          pricingConfig,
          videoAddonOptions
        );

        // Store the breakdown
        setPricingBreakdown(breakdown);
      } catch (err) {
        console.error('Error calculating pricing:', err);
        setError('Failed to calculate pricing. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    calculatePricing();
  }, [selectedFunctions, additionalFunctions, albumConfig, videoAddons, setPricingBreakdown]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Calculating your pricing...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !pricingBreakdown) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to calculate pricing'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            onClick={() => router.push("/wizard/step-3")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Summary */}
      <PriceSummary breakdown={pricingBreakdown} />

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => router.push("/wizard/step-3")}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={() => router.push("/wizard/step-5")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
