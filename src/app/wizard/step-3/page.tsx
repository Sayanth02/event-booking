// app/wizard/step-3/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { AlbumConfig } from "@/components/AlbumConfig";
import { CardContainer } from "@/components/CardContainer";
import { ComplimentaryItemButton } from "@/components/ComplimentaryButton";
import { VideoAddonItem } from "@/components/VideoAddonItem";
import { videoAddonsService, albumConfigService, complimentaryItemsService, VideoAddonOption, AlbumConfiguration, ComplimentaryItemOption } from "@/services";
import { useEffect, useState } from "react";

export default function Step3Page() {
  const router = useRouter();
  const { albumConfig, updateAlbumConfig, setComplimentaryItem, complimentaryItem, videoAddons, toggleVideoAddon } =
    useBookingStore();

  const [videoAddonOptions, setVideoAddonOptions] = useState<VideoAddonOption[]>([]);
  const [albumConfiguration, setAlbumConfiguration] = useState<AlbumConfiguration | null>(null);
  const [complimentaryItemOptions, setComplimentaryItemOptions] = useState<ComplimentaryItemOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch video addons, album configuration, and complimentary items from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [addons, config, complimentaryItems] = await Promise.all([
          videoAddonsService.getAllVideoAddons(),
          albumConfigService.getAlbumConfiguration(),
          complimentaryItemsService.getAllComplimentaryItems(),
        ]);

        setVideoAddonOptions(addons);
        setAlbumConfiguration(config);
        setComplimentaryItemOptions(complimentaryItems);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load configuration. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePagesChange = (pages: number) => {
    updateAlbumConfig({ pages });
  };

  const handleTypeChange = (type: string) => {
    updateAlbumConfig({ type });
  };

  const handleNext = () => {
    router.push("/wizard/step-4");
  };

  const handlePrevious = () => {
    router.push("/wizard/step-2");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !albumConfiguration) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error || 'Failed to load configuration'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AlbumConfig
        pages={albumConfig.pages}
        type={albumConfig.type}
        onPagesChange={handlePagesChange}
        onTypeChange={handleTypeChange}
        basePages={albumConfiguration.basePages}
        pagesIncrement={albumConfiguration.pagesIncrement}
        pricePerTenPages={albumConfiguration.per10PagesCost}
      />
      <CardContainer
        title="Complimentary Selection"
        subtitle="Choose one complimentary item with your package"
        borderColor="[#10B981]"
        bgColor="bg-green-50/50"
      >
        <div className="grid md:grid-cols-3 gap-4">
          {complimentaryItemOptions.map((item) => (
            <ComplimentaryItemButton
              key={item.value}
              label={item.label}
              description={item.description}
              value={item.value}
              isSelected={complimentaryItem === item.value}
              onSelect={setComplimentaryItem}
            />
          ))}
        </div>
        {complimentaryItemOptions.length === 0 && !loading && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No complimentary items available
          </div>
        )}
      </CardContainer>
      <CardContainer
        title="Video Add-Ons"
        subtitle="Select additional video services. Pricing varies by package."
        borderColor="[#3B82F6]"
        bgColor="bg-blue-50/50"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600 text-sm">Loading video add-ons...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {videoAddonOptions.map((addon) => (
                <VideoAddonItem
                  key={addon.value}
                  label={addon.label}
                  description={addon.description}
                  value={addon.value}
                  price={addon.price}
                  isSelected={videoAddons.includes(addon.value)}
                  onToggle={toggleVideoAddon}
                />
              ))}
            </div>

            {videoAddonOptions.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                No video add-ons available
              </div>
            )}
          </>
        )}
      </CardContainer>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
