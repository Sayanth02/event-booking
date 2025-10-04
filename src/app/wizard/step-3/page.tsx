// app/wizard/step-3/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { AlbumConfig } from "@/components/AlbumConfig";
import { CardContainer } from "@/components/CardContainer";
import { COMPLIMENTARY_ITEMS, VIDEO_ADDONS } from "@/lib/constants";
import { Check, Gift, Video } from "lucide-react";
import { ComplimentaryItemButton } from "@/components/ComplimentaryButton";
import { VideoAddonItem } from "@/components/VideoAddonItem";

export default function Step3Page() {
  const router = useRouter();
  const { albumConfig, updateAlbumConfig, setComplimentaryItem, complimentaryItem, videoAddons, toggleVideoAddon } =
    useBookingStore();

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

  return (
    <div className="space-y-8">
      <AlbumConfig
        pages={albumConfig.pages}
        type={albumConfig.type}
        onPagesChange={handlePagesChange}
        onTypeChange={handleTypeChange}
        pricePerTenPages={500}
      />
      <CardContainer
        title="Complimentary Selection"
        subtitle="Choose one complimentary item with your package"
        borderColor="[#10B981]"
        bgColor="bg-green-50/50"
      >
        <div className="grid md:grid-cols-3 gap-4">
          {COMPLIMENTARY_ITEMS.map((item) => (
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
      </CardContainer>
      <CardContainer
        title="Video Add-Ons"
        subtitle="Select additional video services. Pricing varies by package."
        borderColor="[#3B82F6]"
        bgColor="bg-blue-50/50"
      >
        <div className="space-y-3">
          {VIDEO_ADDONS.map((addon) => (
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

        {videoAddons.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No video add-ons selected
          </div>
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
