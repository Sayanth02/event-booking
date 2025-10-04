// app/wizard/step-3/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { Camera, Video, Calendar, Clock } from "lucide-react";

export default function Step4Page() {
  const router = useRouter();
  const { clientInfo, eventDetails, selectedFunctions, additionalFunctions } = useBookingStore();

  if (selectedFunctions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No functions selected yet. Please go back to Step 2.</p>
        <button
          onClick={() => router.push("/wizard/step-2")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ← Back to Step 2
        </button>
      </div>
    );
  }

  const totalPhotographers = selectedFunctions.reduce((sum, fn) => sum + fn.photographers, 0) + 
                             additionalFunctions.reduce((sum, fn) => sum + fn.photographers, 0);
  const totalCinematographers = selectedFunctions.reduce((sum, fn) => sum + fn.cinematographers, 0) + 
                                additionalFunctions.reduce((sum, fn) => sum + fn.cinematographers, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 3: Albums & Add-ons
        </h2>
        <p className="text-gray-600">Review your selected functions and crew details</p>
      </div>

      {/* Client Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Client & Event Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Client Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{clientInfo.fullName || "Not provided"}</span></p>
              <p><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-900">{clientInfo.phone || "Not provided"}</span></p>
              <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{clientInfo.email || "Not provided"}</span></p>
              <p><span className="font-medium text-gray-700">Location:</span> <span className="text-gray-900">{clientInfo.currentLocation || "Not provided"}</span></p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Event Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-gray-700">Booking Type:</span> <span className="text-gray-900">{eventDetails.bookingType || "Not selected"}</span></p>
              <p><span className="font-medium text-gray-700">Event Location:</span> <span className="text-gray-900">{eventDetails.eventLocation || "Not provided"}</span></p>
              <p><span className="font-medium text-gray-700">Event Date:</span> <span className="text-gray-900">{eventDetails.eventDate || "Not set"}</span></p>
              <p><span className="font-medium text-gray-700">Guest Count:</span> <span className="text-gray-900">{eventDetails.guestCount || "Not specified"}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Functions</p>
              <p className="text-3xl font-bold text-blue-900">
                {selectedFunctions.length + additionalFunctions.length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Photographers</p>
              <p className="text-3xl font-bold text-purple-900">{totalPhotographers}</p>
            </div>
            <Camera className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Cinematographers</p>
              <p className="text-3xl font-bold text-green-900">{totalCinematographers}</p>
            </div>
            <Video className="w-10 h-10 text-green-400" />
          </div>
        </div>
      </div>

      {/* Main Functions */}
      {selectedFunctions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👑</span> Main Functions
          </h3>
          <div className="space-y-4">
            {selectedFunctions.map((fn) => (
              <div
                key={fn.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{fn.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {fn.date || "Date not set"}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {fn.startTime} - {fn.endTime}
                      </span>
                      <span className="text-blue-600 font-medium">
                        {fn.duration} hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Camera className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Photographers</p>
                      <p className="text-2xl font-bold text-gray-900">{fn.photographers}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Video className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Cinematographers</p>
                      <p className="text-2xl font-bold text-gray-900">{fn.cinematographers}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Functions */}
      {additionalFunctions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">✨</span> Additional Functions
          </h3>
          <div className="space-y-4">
            {additionalFunctions.map((fn) => (
              <div
                key={fn.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-amber-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{fn.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {fn.date || "Date not set"}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {fn.startTime} - {fn.endTime}
                      </span>
                      <span className="text-amber-600 font-medium">
                        {fn.duration} hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Camera className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Photographers</p>
                      <p className="text-2xl font-bold text-gray-900">{fn.photographers}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Video className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Cinematographers</p>
                      <p className="text-2xl font-bold text-gray-900">{fn.cinematographers}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => router.push("/wizard/step-3")}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={() => router.push("/wizard/step-5")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
