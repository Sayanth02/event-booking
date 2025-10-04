// components/ComplimentaryItemButton.tsx
import { Check, Gift } from "lucide-react";

interface ComplimentaryItemButtonProps {
  label: string;
  description: string;
  value: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export function ComplimentaryItemButton({
  label,
  description,
  value,
  isSelected,
  onSelect,
}: ComplimentaryItemButtonProps) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`relative p-4 border-2 rounded-lg transition-all ${
        isSelected
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:border-green-300"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Gift className="w-6 h-6 text-green-600" />
        </div>
        <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </button>
  );
}
