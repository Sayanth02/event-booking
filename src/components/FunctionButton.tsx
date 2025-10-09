// app/wizard/step-2/components/FunctionButton.tsx
import { Check } from "lucide-react";
import { getFunctionIcon } from "./icons";

interface FunctionButtonProps {
  function: { id: string; label: string; icon?: string };
  isSelected: boolean;
  onToggle: () => void;
  colorScheme: "blue" | "purple";
}

export default function FunctionButton({
  function: func,
  isSelected,
  onToggle,
  colorScheme,
}: FunctionButtonProps) {
  const colors = {
    blue: {
      selected: "border-blue-400 bg-blue-50 ring-2 ring-blue-200/50",
      hover: "border-gray-200 hover:border-blue-300 bg-white",
      check: "text-blue-600",
    },
    purple: {
      selected: "border-purple-400 bg-purple-50 ring-2 ring-purple-200/50",
      hover: "border-gray-200 hover:border-purple-300 bg-white",
      check: "text-purple-600",
    },
  };

  const scheme = colors[colorScheme];
  const Icon = getFunctionIcon(func.label || func.icon);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative p-3 sm:p-4 border rounded-lg transition-all text-center bg-white min-h-[80px] sm:min-h-[90px] flex flex-col items-center justify-center ${
        isSelected ? scheme.selected : scheme.hover
      }`}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${scheme.check}`} />
        </div>
      )}
      <div className="mb-1.5 sm:mb-2 flex items-center justify-center">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </div>
      <div className="text-xs sm:text-sm font-medium text-gray-900 leading-tight break-words px-1">
        {func.label}
      </div>
    </button>
  );
}
