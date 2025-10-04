// lib/validations.ts
import { z } from "zod";

// Step 1: Client & Event Basics validation
export const step1Schema = z.object({
  // Client Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  whatsapp: z.string().optional(),
  email: z.string().email("Invalid email address"),
  homeAddress: z.string().optional(),
  currentLocation: z.string().optional(),

  // Event Details
  bookingType: z.string().min(1, "Please select a booking type"),
  eventLocation: z.string().optional(),
  eventDate: z.string().optional(),
  guestCount: z.string().optional(),
  budgetRange: z.string().optional(),
});

export type Step1FormData = z.infer<typeof step1Schema>;

// Step 2: Event Summary & Crew validation
export const step2Schema = z.object({
  photographers: z.number().min(1, "At least 1 photographer required").max(10),
  cinematographers: z
    .number()
    .min(1, "At least 1 cinematographer required")
    .max(10),
  mainEventStartTime: z.string(),
  mainEventEndTime: z.string(),
});

export type Step2FormData = z.infer<typeof step2Schema>;

// Step 3: Albums & Add-ons validation
export const step3Schema = z.object({
  albumPages: z.number().min(60, "Minimum 60 pages required"),
  albumType: z.string(),
  complimentaryItem: z.string().optional(),
  videoAddons: z.array(z.string()),
});

export type Step3FormData = z.infer<typeof step3Schema>;

// Step 5: Review & Confirm validation
export const step5Schema = z.object({
  digitalSignature: z
    .string()
    .min(2, "Please enter your full name as signature"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type Step5FormData = z.infer<typeof step5Schema>;

// Complete booking validation (for final submission)
export const completeBookingSchema = z.object({
  clientInfo: step1Schema,
  crewSelection: step2Schema,
  albumConfig: step3Schema,
  selectedPackage: z.string().min(1, "Please select a package"),
  confirmation: step5Schema,
});

export type CompleteBookingData = z.infer<typeof completeBookingSchema>;
