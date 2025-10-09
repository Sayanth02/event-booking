import { Camera, Video } from 'lucide-react';
import { getFunctionIcon } from './icons';
import CrewCounter from './CrewCounter';

interface SelectedFunctionCardProps {
  function: any;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
}

// Helper function to calculate duration in hours (rounded to nearest 0.5 hour)
const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;
  
  // Handle case where end time is on the next day
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }
  
  const durationMinutes = endMinutes - startMinutes;
  const durationHours = durationMinutes / 60;
  
  // Round to nearest 0.5 hour (30-minute increments)
  return Math.round(durationHours * 2) / 2;
};

// Helper function to format duration as "Xh Ym"
const formatDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return 'N/A';
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;
  
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }
  
  const totalMinutes = endMinutes - startMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

export default function SelectedFunctionCard({
  function: func,
  onUpdate,
  onRemove,
}: SelectedFunctionCardProps) {
  // Calculate actual duration from start and end times
  const actualDuration = calculateDuration(func.startTime, func.endTime);
  const Icon = getFunctionIcon(func.name || func.icon);
  return (
    <div className="border border-gray-200 rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          <span className="font-semibold text-gray-800 text-base sm:text-lg">{func.name}</span>
        </div>
        <button
          onClick={() => onRemove(func.id)}
          className="text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors border border-red-200"
        >
          Remove
        </button>
      </div>

      {/* Date and Time Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
            onChange={(e) => {
              const newStartTime = e.target.value;
              const newDuration = calculateDuration(newStartTime, func.endTime);
              onUpdate(func.id, { startTime: newStartTime, duration: newDuration });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
          <input
            type="time"
            value={func.endTime}
            onChange={(e) => {
              const newEndTime = e.target.value;
              const newDuration = calculateDuration(func.startTime, newEndTime);
              onUpdate(func.id, { endTime: newEndTime, duration: newDuration });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Duration Display */}
      <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-sm text-gray-600">
            Duration: {actualDuration > 0 ? formatDuration(func.startTime, func.endTime) : 'Set times to calculate'}
            {func.duration && actualDuration !== func.duration && (
              <span className="ml-2 text-xs text-amber-600">
                (Included: {func.duration}h)
              </span>
            )}
          </span>
          <span className={`text-sm font-semibold px-2 py-1 rounded ${
            actualDuration > func.duration 
              ? 'text-amber-700 bg-amber-100' 
              : 'text-green-700 bg-green-100'
          }`}>
            {actualDuration > 0 ? `${actualDuration}h for billing` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Crew Section */}
      <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-gray-100">
        <p className="text-xs sm:text-sm font-medium text-gray-800">Crew for this function</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-3">
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
