// app/wizard/step-2/components/FunctionSelector.tsx
import FunctionButton from "./FunctionButton";
import { Heart } from "lucide-react";

interface FunctionSelectorProps {
  title?: string;
  description?: string;
  functions: Array<{ id: string; label: string; icon: string }>;
  selectedFunctions: Array<{ functionId: string }>;
  onFunctionToggle: (functionId: string) => void;
  colorScheme: "blue" | "purple";
  showWeddingLabel?: boolean;
}

export default function FunctionSelector({
  title,
  description,
  functions,
  selectedFunctions,
  onFunctionToggle,
  colorScheme,
  showWeddingLabel,
}: FunctionSelectorProps) {
  const isSelected = (functionId: string) => {
    return selectedFunctions.some((f) => f.functionId === functionId);
  };

  return (
    <div className="p-1 sm:p-2">
      {title && (
        <div className="flex items-center mb-2 sm:mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {description && (
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{description}</p>
      )}

      {showWeddingLabel && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
            Wedding Functions
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            Classic Memories, Signature Luxury, Gold Moments, Premium Royal
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {functions.map((func) => (
          <FunctionButton
            key={func.id}
            function={func}
            isSelected={isSelected(func.id)}
            onToggle={() => onFunctionToggle(func.id)}
            colorScheme={colorScheme}
          />
        ))}
      </div>
    </div>
  );
}
