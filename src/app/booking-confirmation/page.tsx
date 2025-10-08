"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Download, Home } from "lucide-react";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get("ref");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingRef) {
      setError("No booking reference provided");
      setLoading(false);
      return;
    }

    // Fetch booking details
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings?reference=${bookingRef}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to fetch booking");
        }

        setBooking(result.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(err instanceof Error ? err.message : "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Booking not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-6">
          <div className="text-green-500 mb-4">
            <CheckCircle className="w-20 h-20 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your booking has been successfully submitted. Please save your booking reference for future communication.
          </p>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
            <p className="text-3xl font-bold text-blue-600">{booking.booking_reference}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600">Client Name</p>
              <p className="font-semibold text-gray-900">{booking.client_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{booking.client_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(booking.event_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Location</p>
              <p className="font-semibold text-gray-900">{booking.event_location}</p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-gray-900">₹{booking.total_price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Advance Required (30%):</span>
              <span className="font-semibold text-orange-600">₹{booking.advance_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Balance Amount:</span>
              <span className="font-semibold text-gray-700">₹{booking.balance_amount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Payment Status:</strong> {booking.payment_status.replace('_', ' ').toUpperCase()}
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              Please contact us to arrange the advance payment to confirm your booking.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Save your booking reference number: <strong>{booking.booking_reference}</strong></li>
            <li>We will contact you within 24 hours to confirm payment details</li>
            <li>Pay the advance amount to confirm your booking</li>
            <li>Balance payment is due 7 days before the event date</li>
            <li>You will receive a detailed booking summary via email</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Print / Save as PDF
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>For any queries, please contact us with your booking reference.</p>
        </div>
      </div>
    </div>
  );
}
