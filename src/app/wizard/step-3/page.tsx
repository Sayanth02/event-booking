// app/wizard/step-3/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { AlbumConfig } from "@/components/AlbumConfig";

export default function Step3Page() {
  const router = useRouter();
  const { albumConfig, updateAlbumConfig } = useBookingStore();

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
