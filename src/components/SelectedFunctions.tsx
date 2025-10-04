// app/wizard/step-2/components/SelectedFunctions.tsx
import { useBookingStore } from "@/lib/store";
import SelectedFunctionCard from "./SelectedFunctionCard";

interface SelectedFunctionsProps {
  title?: string;
  selectedFunctions: Array<any>;
  onUpdate: (id: string, updates: any) => void; // Generic update function
  onRemove: (id: string) => void; // Generic remove function
}

export default function SelectedFunctions({
  title = "Selected Main Functions",
  selectedFunctions,
  onUpdate,
  onRemove,
}: SelectedFunctionsProps) {
  return (
    <div className="pt-6">
      <h3 className="text-xl font-semibold mb-4 px-6 text-gray-900">{title}</h3>
      <div className="space-y-4">
        {selectedFunctions.map((func) => (
          <SelectedFunctionCard
            key={func.id}
            function={func}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
