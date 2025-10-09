// app/wizard/step-2/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import FunctionSelector from "@/components/FunctionSelector";
import SelectedFunctions from "@/components/SelectedFunctions";
import { CardContainer } from "@/components/CardContainer";
import { eventsService, EventFunction } from "@/services";
import { useEffect, useState } from "react";

export default function Step2Page() {
  const router = useRouter();
  const { selectedFunctions, addSelectedFunction, updateSelectedFunction, removeSelectedFunction, additionalFunctions, addAdditionalFunction, removeAdditionalFunction,updateAdditionalFunction} =
    useBookingStore();

  const [mainFunctions, setMainFunctions] = useState<EventFunction[]>([]);
  const [otherFunctions, setOtherFunctions] = useState<EventFunction[]>([]);
  const [additionalFunctionTypes, setAdditionalFunctionTypes] = useState<EventFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event functions from database
  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [main, other, additional] = await Promise.all([
          eventsService.getMainFunctions(),
          eventsService.getOtherFunctions(),
          eventsService.getAdditionalFunctions(),
        ]);

        setMainFunctions(main);
        setOtherFunctions(other);
        setAdditionalFunctionTypes(additional);
      } catch (err) {
        console.error('Error fetching functions:', err);
        setError('Failed to load event functions. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, []);

  const allFunctions = [...mainFunctions, ...otherFunctions];

  // Helper function to calculate duration in hours from start and end time
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
    return Math.round((durationMinutes / 60) * 10) / 10; // Round to 1 decimal place
  };

  // Helper function to calculate end time from start time and duration (in hours)
  const calculateEndTime = (startTime: string, durationHours: number): string => {
    if (!startTime || !durationHours) return "";
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = startMinutes + (durationHours * 60);
    
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMin = endMinutes % 60;
    
    return `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
  };

  const handleFunctionToggle = (functionId: string) => {
    const isSelected = selectedFunctions.some(
      (f) => f.functionId === functionId
    );

    if (isSelected) {
      const func = selectedFunctions.find((f) => f.functionId === functionId);
      if (func) removeSelectedFunction(func.id);
    } else {
      const funcConfig = allFunctions.find((f) => f.id === functionId);
      if (!funcConfig) return;

      const defaultStartTime = "07:30";
      const calculatedEndTime = calculateEndTime(defaultStartTime, funcConfig.defaultHours);
      
      addSelectedFunction({
        id: `${functionId}-${Date.now()}`,
        functionId: functionId,
        name: funcConfig.label,
        date: "",
        startTime: defaultStartTime,
        endTime: calculatedEndTime,
        duration: funcConfig.defaultHours,
        photographers: funcConfig.includedPhotographers,
        cinematographers: funcConfig.includedCinematographers,
      });
    }
  };

  const handleAdditionalToggle = (functionId: string) => {
    const isSelected = additionalFunctions.some(
      (f) => f.functionId === functionId
    );
    if (isSelected) {
      const func = additionalFunctions.find((f) => f.functionId === functionId);
      if (func) removeAdditionalFunction(func.id);
    } else {
      const funcConfig = additionalFunctionTypes.find((f) => f.id === functionId);
      if (!funcConfig) return;
      
      const defaultStartTime = "07:30";
      const calculatedEndTime = calculateEndTime(defaultStartTime, funcConfig.defaultHours);
      
      addAdditionalFunction({
        id: `${functionId}-${Date.now()}`,
        functionId: functionId,
        name: funcConfig.label,
        date: "",
        startTime: defaultStartTime,
        endTime: calculatedEndTime,
        duration: funcConfig.defaultHours,
        photographers: funcConfig.includedPhotographers,
        cinematographers: funcConfig.includedCinematographers,
      });
    }      
  }

  const handleNext = () => {
    if (selectedFunctions.length === 0) {
      alert("Please select at least one function");
      return;
    }
    router.push("/wizard/step-3");
  };

  const handlePrevious = () => {
    router.push("/wizard/step-1");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading event functions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <CardContainer
        title="Main Event&Functions"
        subtitle="Select your main and other functions & configure crew and timing"
        borderColor="#2563eb"
        bgColor="bg-blue-100/50"
      >
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <FunctionSelector
            functions={mainFunctions}
            selectedFunctions={selectedFunctions}
            onFunctionToggle={handleFunctionToggle}
            colorScheme="blue"
            showWeddingLabel
          />

          <hr className="my-3 sm:my-4 border-gray-200" />

          <div className="mb-1">
            <p className="text-base sm:text-lg font-medium">Other Functions</p>
          </div>
          <FunctionSelector
            functions={otherFunctions}
            selectedFunctions={selectedFunctions}
            onFunctionToggle={handleFunctionToggle}
            colorScheme="purple"
          />

          {selectedFunctions.length > 0 && (
            <div>
              <SelectedFunctions
                onUpdate={updateSelectedFunction}
                onRemove={removeSelectedFunction}
                selectedFunctions={selectedFunctions}
              />
            </div>
          )}
        </div>
      </CardContainer>

      <CardContainer
        title="Additional Functions"
        subtitle="Add extra events with individual crew assignments"
        borderColor="#7c3aed"
        bgColor="bg-violet-300/20"
      >
        <div className="space-y-4 sm:space-y-6">
          <FunctionSelector
            functions={additionalFunctionTypes}
            selectedFunctions={additionalFunctions}
            onFunctionToggle={handleAdditionalToggle}
            colorScheme="purple"
          />
          {additionalFunctions.length > 0 && (
            <div>
              <SelectedFunctions
                title="Selected Additional Functions"
                onUpdate={updateAdditionalFunction}
                onRemove={removeAdditionalFunction}
                selectedFunctions={additionalFunctions}
              />
            </div>
          )}
        </div>
      </CardContainer>

      {/* Navigation */}
      <div className="flex justify-between gap-2 sm:gap-4">
        <button
          onClick={() => router.push("/wizard/step-1")}
          className="px-3 sm:px-4 md:px-6 py-2 border border-gray-300 rounded-md text-sm sm:text-base text-gray-700 hover:bg-gray-50"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-3 sm:px-4 md:px-6 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}


