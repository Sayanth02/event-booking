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
      className={`relative p-4 border rounded-lg transition-all text-center bg-white ${
        isSelected ? scheme.selected : scheme.hover
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Check className={`w-4 h-4 ${scheme.check}`} />
        </div>
      )}
      <div className="mb-2 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-700" />
      </div>
      <div className="text-sm font-small text-gray-900">{func.label}</div>
    </button>
  );
}
