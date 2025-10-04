// app/wizard/step-2/components/FunctionSelector.tsx
import FunctionButton from "./FunctionButton";

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
    <div className="p-1">
      {title && (
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}

      {showWeddingLabel && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">❤️ Wedding Functions</h3>
          <p className="text-xs text-gray-500 mt-1">
            Classic Memories, Signature Luxury, Gold Moments, Premium Royal
          </p>
        </div>
      )}

      <div className="grid grid-flow-col auto-cols-fr gap-4">
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
