// app/wizard/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import WizardProgress from "@/components/WizardProgress";
import { WIZARD_STEPS } from "@/lib/constants";

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine current step from pathname
  const currentStep =
    WIZARD_STEPS.findIndex((step) => pathname === step.path) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-blue-900">
            Professional Event Booking System
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Photography & Videography Services
          </p>
        </div>
      </header>

      {/* Progress indicator */}
      <WizardProgress currentStep={currentStep || 1} />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
