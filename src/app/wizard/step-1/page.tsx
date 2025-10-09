// app/wizard/step-1/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store";
import { step1Schema, type Step1FormData } from "@/lib/validations";
import {
  BOOKING_TYPES,
  EVENT_TYPES,
  GUEST_RANGES,
  BUDGET_RANGES,
} from "@/lib/constants";
import {CardContainer} from '@/components/CardContainer';

export default function Step1Page() {
  const router = useRouter();
  const { clientInfo, eventDetails, updateClientInfo, updateEventDetails } =
    useBookingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      ...clientInfo,
      ...eventDetails,
    },
  });

  const onSubmit = (data: Step1FormData) => {
    // Save to store
    updateClientInfo({
      fullName: data.fullName,
      phone: data.phone,
      whatsapp: data.whatsapp || "",
      email: data.email,
      homeAddress: data.homeAddress || "",
      currentLocation: data.currentLocation || "",
    });

    updateEventDetails({
      bookingType: data.bookingType,
      // eventTypes: data.eventTypes,
      eventLocation: data.eventLocation || "",
      eventDate: data.eventDate || "",
      guestCount: data.guestCount || "",
      budgetRange: data.budgetRange || "",
    });

    // Navigate to next step
    router.push("/wizard/step-2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Client Information Section */}
      <CardContainer title="Client Information" borderColor="[#030213]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("fullName")}
              type="text"
              id="fullName"
              placeholder="Enter full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              WhatsApp
            </label>
            <input
              {...register("whatsapp")}
              type="tel"
              id="whatsapp"
              placeholder="WhatsApp number (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Home Address */}
          <div>
            <label
              htmlFor="homeAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Home Address
            </label>
            <input
              {...register("homeAddress")}
              type="text"
              id="homeAddress"
              placeholder="Enter home address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Current Location */}
          <div>
            <label
              htmlFor="currentLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Location
            </label>
            <input
              {...register("currentLocation")}
              type="text"
              id="currentLocation"
              placeholder="Enter current location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContainer>

      {/* Event Summary Section */}
      <CardContainer title="Event Summary">
        <div className="space-y-4">
          {/* Booking Type */}
          <div>
            <label
              htmlFor="bookingType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Booking Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("bookingType")}
              id="bookingType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select booking type</option>
              {BOOKING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.bookingType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bookingType.message}
              </p>
            )}
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Location */}
            <div>
              <label
                htmlFor="eventLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Location <span className="text-red-500">*</span>
              </label>
              <input
                {...register("eventLocation")}
                type="text"
                id="eventLocation"
                placeholder="Enter event location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Event Date */}
            <div>
              <label
                htmlFor="eventDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Date
              </label>
              <input
                {...register("eventDate")}
                type="date"
                id="eventDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Guest Range */}
            <div>
              <label
                htmlFor="guestCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Guest Range
              </label>
              <select
                {...register("guestCount")}
                id="guestCount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select guest range</option>
                {GUEST_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label
                htmlFor="budgetRange"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Budget Range
              </label>
              <select
                {...register("budgetRange")}
                id="budgetRange"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select budget range</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardContainer>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Next Step →
        </button>
      </div>
    </form>
  );
}
