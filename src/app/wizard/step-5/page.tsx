// app/wizard/step-5/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { User, Calendar, Clock, Camera, Video, BookOpen, Gift } from "lucide-react";
import { ALBUM_TYPES, PRICING_CONFIG } from "@/lib/constants";
import { videoAddonsService, complimentaryItemsService, VideoAddonOption, ComplimentaryItemOption } from "@/services";
import { useEffect, useState } from "react";

export default function Step5Page() {
  const router = useRouter();
  const {
    clientInfo,
    eventDetails,
    selectedFunctions,
    additionalFunctions,
    albumConfig,
    complimentaryItem,
    videoAddons,
    selectedPackage,
    selectedPackageId,
    totalPrice,
    advanceAmount,
    balanceAmount,
    pricingBreakdown,
  } = useBookingStore();

  const [videoAddonOptions, setVideoAddonOptions] = useState<VideoAddonOption[]>([]);
  const [complimentaryItemOptions, setComplimentaryItemOptions] = useState<ComplimentaryItemOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [digitalSignature, setDigitalSignature] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch video addons and complimentary items from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [addons, items] = await Promise.all([
          videoAddonsService.getAllVideoAddons(),
          complimentaryItemsService.getAllComplimentaryItems(),
        ]);
        setVideoAddonOptions(addons);
        setComplimentaryItemOptions(items);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleSubmit = async () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }
    if (!digitalSignature.trim()) {
      alert("Please provide your digital signature");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare booking data
      const bookingData = {
        // Client Information
        client_name: clientInfo.fullName,
        client_phone: clientInfo.phone,
        client_whatsapp: clientInfo.whatsapp,
        client_email: clientInfo.email,
        client_home_address: clientInfo.homeAddress,
        client_current_location: clientInfo.currentLocation,
        
        // Event Details
        booking_type: eventDetails.bookingType,
        event_location: eventDetails.eventLocation,
        event_date: eventDetails.eventDate,
        guest_count: eventDetails.guestCount,
        budget_range: eventDetails.budgetRange,
        
        // Selected Functions
        selected_functions: selectedFunctions,
        additional_functions: additionalFunctions,
        
        // Crew Information
        total_photographers: totalPhotographers,
        total_cinematographers: totalCinematographers,
        main_event_start_time: selectedFunctions[0]?.startTime,
        main_event_end_time: selectedFunctions[0]?.endTime,
        
        // Album Configuration
        album_type: albumConfig.type,
        album_pages: albumConfig.pages,
        
        // Add-ons
        video_addons: videoAddons,
        complimentary_item: complimentaryItem,
        
        // Package & Pricing
        selected_package: selectedPackage,
        selected_package_id: selectedPackageId,
        total_price: totalPrice,
        advance_amount: advanceAmount,
        balance_amount: balanceAmount,
        pricing_breakdown: pricingBreakdown,
        
        // Terms & Signature
        digital_signature: digitalSignature,
        terms_accepted: termsAccepted,
      };

      // Submit to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit booking');
      }

      // Success! Show booking reference and redirect
      alert(`Booking submitted successfully!\n\nBooking Reference: ${result.bookingReference}\n\nPlease save this reference number for future communication.`);
      
      // Optionally redirect to a success page or reset the form
      router.push(`/booking-confirmation?ref=${result.bookingReference}`);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-white p-6 rounded-lg">
      {/* Grid Layout - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information Card */}
        <div className="bg-gray-50/50 rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Client Information
            </h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {clientInfo.phone || "Not provided"}
            </p>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-gray-50/50 rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Event Details
            </h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Bride Side</span>
            </p>
            <p>
              <span className="font-medium">Events:</span>
            </p>
            <p>
              <span className="font-medium">Guests:</span>{" "}
              {eventDetails.guestCount || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Budget:</span>{" "}
              {eventDetails.budgetRange || "Not specified"}
            </p>
          </div>
        </div>

        {/* Schedule & Crew Card */}
        <div className="bg-gray-50/50 rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Schedule & Crew
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            {selectedFunctions.map((fn, idx) => (
              <div key={fn.id}>
                <p className="font-medium">
                  {idx === 0 ? "Main Event" : fn.name}: {fn.startTime} -{" "}
                  {fn.endTime}
                </p>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t">
              <p className="font-medium">Main Event Crew:</p>
              <p className="flex items-center gap-1">
                <Camera className="w-4 h-4" /> {totalPhotographers}{" "}
                Photographer(s)
              </p>
              <p className="flex items-center gap-1">
                <Video className="w-4 h-4" /> {totalCinematographers}{" "}
                Cinematographer(s)
              </p>
            </div>
          </div>
        </div>

        {/* Albums & Add-ons Card */}
        <div className="bg-gray-50/50 rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Albums & Add-ons
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium">
                Album:{" "}
                {ALBUM_TYPES.find((t) => t.value === albumConfig.type)?.label ||
                  albumConfig.type}
              </p>
              <p>Pages: {albumConfig.pages}</p>
            </div>
            <div className="pt-3 border-t">
              <p className="font-medium">Video Add-ons:</p>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : videoAddons.length > 0 ? (
                videoAddons.map((val) => {
                  const addon = videoAddonOptions.find((v) => v.value === val);
                  return <p key={val}>{addon?.label || val}</p>;
                })
              ) : (
                <p className="text-gray-500">None selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Package & Pricing Card - Full Width */}
      <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-3xl font-bold text-blue-600">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between text-sm border-t pt-3">
            <div>
              <p className="text-gray-600">Advance Required (30%):</p>
              <p className="text-gray-600">Balance Amount:</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{advanceAmount.toLocaleString()}</p>
              <p className="font-semibold">₹{balanceAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Terms & Confirmation - Full Width */}
      <div className="bg-gray-50/50 rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Terms & Confirmation
        </h3>

        <div className="space-y-3 text-sm text-gray-700 mb-6">
          <p className="font-medium">Payment Terms:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>30% advance payment required to confirm booking</li>
            <li>Balance amount due 7 days before event date</li>
            <li>Payments accepted via bank transfer, UPI, or card</li>
            <li>
              Cancellation policy: 50% refund if cancelled 30+ days before event
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digital Signature (Full Name)
            </label>
            <input
              type="text"
              value={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.value)}
              placeholder="Type your full name as digital signature"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={submitting}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the terms and conditions and confirm all details are
              accurate
            </label>
          </div>
        </div>

        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!termsAccepted || !digitalSignature.trim() || submitting}
          className="w-full mt-6 px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Confirm Booking & Submit"}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => router.push("/wizard/step-4")}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
