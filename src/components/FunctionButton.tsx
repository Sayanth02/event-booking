// app/wizard/step-2/components/FunctionButton.tsx
import { Check } from "lucide-react";

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
      selected: "border-blue-500 bg-white",
      hover: "border-gray-200 hover:border-blue-300 bg-white",
      check: "bg-blue-500",
    },
    purple: {
      selected: "border-purple-500 bg-white",
      hover: "border-gray-200 hover:border-purple-300 bg-white",
      check: "bg-purple-500",
    },
  };

  const scheme = colors[colorScheme];

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative p-4 border-2 rounded-lg transition-all text-center bg-white ${
        isSelected ? scheme.selected : scheme.hover
      }`}
    >
      {isSelected && (
        <div
          className={`absolute top-2 right-2 w-5 h-5 ${scheme.check} rounded-full flex items-center justify-center`}
        >
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="text-xl mb-2">{func.icon}</div>
      <div className="text-sm font-small text-gray-900">{func.label}</div>
    </button>
  );
}
