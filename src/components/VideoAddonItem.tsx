// components/VideoAddonItem.tsx
import { Video } from "lucide-react";

interface VideoAddonItemProps {
  label: string;
  description: string;
  value: string;
  price: number;
  isSelected: boolean;
  onToggle: (value: string) => void;
}

export function VideoAddonItem({
  label,
  description,
  value,
  price,
  isSelected,
  onToggle,
}: VideoAddonItemProps) {
  return (
    <label
      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(value)}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
      />
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-900">{label}</span>
          </div>
          <span className="text-sm font-bold text-blue-600">
            +₹{price.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </label>
  );
}
