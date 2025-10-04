// app/wizard/step-2/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { ADDITIONAL_FUNCTION_TYPES, MAIN_FUNCTIONS, OTHER_FUNCTIONS } from "@/lib/constants";
import FunctionSelector from "@/components/FunctionSelector";
import SelectedFunctions from "@/components/SelectedFunctions";
import { CardContainer } from "@/components/CardContainer";

export default function Step2Page() {
  const router = useRouter();
  const { selectedFunctions, addSelectedFunction, updateSelectedFunction, removeSelectedFunction, additionalFunctions, addAdditionalFunction, removeAdditionalFunction,updateAdditionalFunction} =
    useBookingStore();

  const allFunctions = [...MAIN_FUNCTIONS, ...OTHER_FUNCTIONS];

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

      addSelectedFunction({
        id: `${functionId}-${Date.now()}`,
        functionId: functionId,
        name: funcConfig.label,
        date: "",
        startTime: "07:30",
        endTime: "15:30",
        duration: 8,
        photographers: 2,
        cinematographers: 2,
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
      const funcConfig = ADDITIONAL_FUNCTION_TYPES.find((f) => f.id === functionId);
      if (!funcConfig) return;
      addAdditionalFunction({
        id: `${functionId}-${Date.now()}`,
        functionId: functionId,
        name: funcConfig.label,
        date: "",
        startTime: "07:30",
        endTime: "15:30",
        duration: funcConfig.defaultHours,
        photographers: 1,
        cinematographers: 1,
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

  return (
    <div className="space-y-8">
      <CardContainer
        title="Main Event&Functions"
        subtitle="Select your main and other functions & configure crew and timing"
        borderColor="#2563eb"
        bgColor="bg-white"
      >
        <div className="space-y-8">
          <FunctionSelector
            functions={[...MAIN_FUNCTIONS]}
            selectedFunctions={selectedFunctions}
            onFunctionToggle={handleFunctionToggle}
            colorScheme="blue"
            showWeddingLabel
          />

          <hr className="my-4 border-gray-200" />

          <div className="mb-1">
            <p className="font-xl">Other Functions</p>
          </div>
          <FunctionSelector
            functions={[...OTHER_FUNCTIONS]}
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
        bgColor="bg-white"
      >
        <div className="space-y-6">
          <FunctionSelector
            functions={[...ADDITIONAL_FUNCTION_TYPES]}
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
      <div className="flex justify-between">
        <button
          onClick={() => router.push("/wizard/step-1")}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}


