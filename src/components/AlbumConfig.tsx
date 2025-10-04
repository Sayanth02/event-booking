// components/AlbumConfig.tsx
"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { ALBUM_TYPES } from "@/lib/constants";
import { CardContainer } from "./CardContainer";

interface AlbumConfigProps {
  pages: number;
  type: string;
  onPagesChange: (pages: number) => void;
  onTypeChange: (type: string) => void;
  pricePerTenPages?: number;
}

export const AlbumConfig: React.FC<AlbumConfigProps> = ({
  pages,
  type,
  onPagesChange,
  onTypeChange,
  pricePerTenPages = 500,
}) => {
  const handleIncrement = () => {
    onPagesChange(pages + 10);
  };

  const handleDecrement = () => {
    if (pages > 60) {
      onPagesChange(pages - 10);
    }
  };

  const extraPages = Math.max(0, pages - 60);
  const extraCost = (extraPages / 10) * pricePerTenPages;

  return (
    <CardContainer title="Album Configuration" subtitle="Base: 60 pages  Recommended minimum: 60 pages " borderColor="#ef4444" bgColor="bg-red-50/50">
      {/* Header with base/recommended */}
      {/* <div className="mb-6 border border-rose-200 bg-rose-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-rose-700">Album Configuration</h3>
          <div className="text-xs text-rose-600 space-x-4">
            <span>Base: <b>60 pages</b></span>
            <span>Recommended minimum: <b>60 pages</b></span>
          </div>
        </div>
      </div> */}

      {/* Total Album Pages */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Total Album Pages</label>
        <div className="flex items-center">
          <button
            onClick={handleDecrement}
            disabled={pages <= 60}
            className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex-1 mx-3">
            <div className="w-full h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-900 font-semibold">
              {pages}
            </div>
          </div>
          <button
            onClick={handleIncrement}
            className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onPagesChange(60)}
            className="ml-3 px-3 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          You can add more pages in increments of 10 for ₹{pricePerTenPages} per 10 pages
        </p>
      </div>

      {/* Album Type as radios */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Album Type</label>
        <div className="space-y-3">
          {ALBUM_TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors ${
                type === t.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="album-type"
                  value={t.value}
                  checked={type === t.value}
                  onChange={() => onTypeChange(t.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-800">{t.label}</span>
              </div>
              {"recommended" in t && (t as any).recommended && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700">
                  Recommended
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Recommendation note */}
      <div className="mt-4">
        <div className="text-sm bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-700">
          <span className="font-medium">Recommendation:</span> {type === "one-photobook" ? "Standard single album with extra pages for additional functions" : "Two separate albums, ideal when both sides want individual albums"}
        </div>
      </div>


    </CardContainer>
  );
};
