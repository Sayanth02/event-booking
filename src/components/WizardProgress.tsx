'use client'
import { WIZARD_STEPS, TOTAL_STEPS } from "@/lib/constants";


interface WizardProgressProps {
  currentStep: number;
}


export default function WizardProgress({ currentStep }: WizardProgressProps) {
  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
          <p className="text-sm font-medium text-[#030213]">
            {progressPercentage}% Complete
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-[#030213] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Current step title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
          {WIZARD_STEPS[currentStep - 1]?.title}
        </h2>
      </div>
    </div>
  );
}