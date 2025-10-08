import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import { PricingBreakdown } from '@/types/events'

export interface ClientInfo {
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  homeAddress: string;
  currentLocation: string;
}

export interface EventDetails {
  bookingType: string;
  eventLocation: string;
  eventDate: string;
  guestCount: string;
  budgetRange: string;
}

export interface SelectedFunction {
  id: string;
  functionId: string; 
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  photographers: number;
  cinematographers: number;
}

export interface CrewSelection {
  photographers: number;
  cinematographers: number;
  mainEventStartTime: string;
  mainEventEndTime: string;
}

export interface AlbumConfig {
  pages: number;
  type: string;
}

export interface AdditionalFunction {
  id: string;
  functionId: string; 
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  photographers: number;
  cinematographers: number;
}


export interface BookingState {
  // Step 1: Client & Event Basics
  clientInfo: ClientInfo;
  eventDetails: EventDetails;

  // Step 2: Event Summary & Crew
  selectedFunctions: SelectedFunction[];
  additionalFunctions: AdditionalFunction[];
  crewSelection: CrewSelection;

  // Step 3: Albums & Add-ons
  albumConfig: AlbumConfig;
  complimentaryItem: string;
  videoAddons: string[];

  // Step 4: Package Selection
  selectedPackage: string | null;
  selectedPackageId: string | null;

  // Pricing
  totalPrice: number;
  advanceAmount: number;
  balanceAmount: number;
  pricingBreakdown: PricingBreakdown | null;

  // Actions
  updateClientInfo: (data: Partial<ClientInfo>) => void;
  updateEventDetails: (data: Partial<EventDetails>) => void;
  updateCrewSelection: (data: Partial<CrewSelection>) => void;
  addSelectedFunction: (func: SelectedFunction) => void;
  updateSelectedFunction: (
    id: string,
    updates: Partial<SelectedFunction>
  ) => void;
  removeSelectedFunction: (id: string) => void;
  updateAlbumConfig: (data: Partial<AlbumConfig>) => void;
  setComplimentaryItem: (item: string) => void;
  toggleVideoAddon: (addon: string) => void;
  addAdditionalFunction: (func: AdditionalFunction) => void;
  updateAdditionalFunction: (
    id: string,
    data: Partial<AdditionalFunction>
  ) => void;
  removeAdditionalFunction: (id: string) => void;
  selectPackage: (
    packageName: string,
    packageId: string,
    price: number
  ) => void;
  setPricingBreakdown: (breakdown: PricingBreakdown) => void;
  calculatePricing: () => void;
  resetForm: () => void;
}



const initialState = {
  clientInfo: {
    fullName: "",
    phone: "",
    whatsapp: "",
    email: "",
    homeAddress: "",
    currentLocation: "",
  },
  eventDetails: {
    bookingType: "",
    // eventTypes: [],
    eventLocation: "",
    eventDate: "",
    guestCount: "",
    budgetRange: "",
  },
  selectedFunctions: [],
  crewSelection: {
    photographers: 2,
    cinematographers: 2,
    mainEventStartTime: "07:00",
    mainEventEndTime: "15:30",
  },
  additionalFunctions: [],
  albumConfig: {
    pages: 60,
    type: "one-photobook",
  },
  complimentaryItem: "",
  videoAddons: [],
  selectedPackage: null,
  selectedPackageId: null,
  totalPrice: 0,
  advanceAmount: 0,
  balanceAmount: 0,
  pricingBreakdown: null,
};



export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateClientInfo: (data) =>
        set((state) => ({
          clientInfo: { ...state.clientInfo, ...data },
        })),

      updateEventDetails: (data) =>
        set((state) => ({
          eventDetails: { ...state.eventDetails, ...data },
        })),

      addSelectedFunction: (func) =>
        set((state) => ({
          selectedFunctions: [...state.selectedFunctions, func],
        })),

      updateSelectedFunction: (id, updates) =>
        set((state) => ({
          selectedFunctions: state.selectedFunctions.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      removeSelectedFunction: (id) =>
        set((state) => ({
          selectedFunctions: state.selectedFunctions.filter((f) => f.id !== id),
        })),

      updateCrewSelection: (data) =>
        set((state) => ({
          crewSelection: { ...state.crewSelection, ...data },
        })),

      updateAlbumConfig: (data) =>
        set((state) => ({
          albumConfig: { ...state.albumConfig, ...data },
        })),

      setComplimentaryItem: (item) => set({ complimentaryItem: item }),

      toggleVideoAddon: (addon) =>
        set((state) => {
          const exists = state.videoAddons.includes(addon);
          return {
            videoAddons: exists
              ? state.videoAddons.filter((a) => a !== addon)
              : [...state.videoAddons, addon],
          };
        }),

      addAdditionalFunction: (func) =>
        set((state) => ({
          additionalFunctions: [...state.additionalFunctions, func],
        })),
      updateAdditionalFunction: (id, data) =>
        set((state) => ({
          additionalFunctions: state.additionalFunctions.map((func) =>
            func.id === id ? { ...func, ...data } : func
          ),
        })),

      removeAdditionalFunction: (id) =>
        set((state) => ({
          additionalFunctions: state.additionalFunctions.filter(
            (f) => f.id !== id
          ),
        })),

      selectPackage: (packageName, packageId, price) =>
        set(() => {
          const advanceAmount = Math.round(price * 0.3);
          const balanceAmount = price - advanceAmount;
          return {
            selectedPackage: packageName,
            selectedPackageId: packageId,
            totalPrice: price,
            advanceAmount,
            balanceAmount,
          };
        }),

      setPricingBreakdown: (breakdown) =>
        set({
          pricingBreakdown: breakdown,
          totalPrice: breakdown.total,
          advanceAmount: breakdown.advance,
          balanceAmount: breakdown.balance,
        }),

      calculatePricing: () => {
        const state = get();
        // This will be called from the pricing engine
        // For now, just recalculate advance/balance if total changed
        if (state.totalPrice > 0) {
          const advanceAmount = Math.round(state.totalPrice * 0.3);
          const balanceAmount = state.totalPrice - advanceAmount;
          set({ advanceAmount, balanceAmount });
        }
      },

      resetForm: () => set(initialState),
    }),
    {
      name: "booking-storage", // localStorage key
      // Only persist essential data, not UI state
      partialize: (state) => ({
        clientInfo: state.clientInfo,
        eventDetails: state.eventDetails,
        selectedFunctions: state.selectedFunctions,
        crewSelection: state.crewSelection,
        additionalFunctions: state.additionalFunctions,
        albumConfig: state.albumConfig,
        complimentaryItem: state.complimentaryItem,
        videoAddons: state.videoAddons,
        selectedPackage: state.selectedPackage,
        selectedPackageId: state.selectedPackageId,
        totalPrice: state.totalPrice,
        pricingBreakdown: state.pricingBreakdown,
      }),
    }
  )
);