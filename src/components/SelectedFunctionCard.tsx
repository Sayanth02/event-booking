import { Camera, Video } from 'lucide-react';
import CrewCounter from './CrewCounter';

interface SelectedFunctionCardProps {
  function: any;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
}

export default function SelectedFunctionCard({
  function: func,
  onUpdate,
  onRemove,
}: SelectedFunctionCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{func.icon || '🎉'}</span>
          <span className="font-semibold text-gray-800 text-lg">{func.name}</span>
        </div>
        <button
          onClick={() => onRemove(func.id)}
          className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-md transition-colors border border-red-200"
        >
          Remove
        </button>
      </div>

      {/* Date and Time Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={func.date}
            onChange={(e) => onUpdate(func.id, { date: e.target.value })}
            placeholder="dd-mm-yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
          <input
            type="time"
            value={func.startTime}
            onChange={(e) => onUpdate(func.id, { startTime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
          <input
            type="time"
            value={func.endTime}
            onChange={(e) => onUpdate(func.id, { endTime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Duration Display */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Duration: Standard ({func.duration} hrs)</span>
          <span className="text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
            {func.duration} hours total included
          </span>
        </div>
      </div>

      {/* Crew Section */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-800">Crew for this function</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <CrewCounter
            label={
              <span className="flex items-center"><Camera className="w-4 h-4 mr-2 text-gray-500" /> Photographers</span>
            }
            value={func.photographers}
            onChange={(newValue) =>
              onUpdate(func.id, { photographers: newValue })
            }
            min={0}
            max={10}
          />
          <CrewCounter
            label={
              <span className="flex items-center"><Video className="w-4 h-4 mr-2 text-gray-500" /> Cinematographers</span>
            }
            value={func.cinematographers}
            onChange={(newValue) =>
              onUpdate(func.id, { cinematographers: newValue })
            }
            min={0}
            max={10}
          />
        </div>
      </div>
    </div>
  );
}
