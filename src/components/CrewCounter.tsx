// app/wizard/step-2/components/CrewCounter.tsx
import { ReactNode } from 'react';

interface CrewCounterProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function CrewCounter({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
}: CrewCounterProps) {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm text-gray-800 font-medium">{label}</span>
      <div className="flex items-center space-x-2 bg-white rounded-md border border-gray-300 px-2 py-1">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-7 h-7 rounded-md flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          -
        </button>
        <span className="w-8 text-center text-lg font-semibold text-gray-900">
          {value}
        </span>
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-7 h-7 rounded-md flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
