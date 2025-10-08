export const BOOKING_TYPES = [
  'Bride Side',
  'Groom Side',
  'Both Side',
  'Corporate Event',
  'Other'
] as const

export const EVENT_TYPES = [
  'Engagement',
  'Wedding',
  'Reception',
  'Birthday',
  'Anniversary',
  'Newborn',
  'Baptism',
  'Other'
] as const

export const GUEST_RANGES = [
  '1-50',
  '50-100',
  '100-200',
  '200-300',
  '300-500',
  '500+'
] as const

export const BUDGET_RANGES = [
  'Up to ₹50k',
  '₹50k-₹80k',
  '₹80k-₹1L',
  '₹1L-₹1.5L',
  '₹1.5L-₹2L',
  '₹2L+'
] as const



// export const MAIN_FUNCTIONS = [
//   { id: "engagement", label: "Engagement", icon: "💍", defaultHours: 8 },
//   { id: "wedding", label: "Wedding", icon: "👰", defaultHours: 8 },
//   {
//     id: "wedding-engagement",
//     label: "Wedding and Engagement",
//     icon: "💒",
//     defaultHours: 10,
//   },
//   { id: "reception", label: "Reception", icon: "🎊", defaultHours: 6 },
//   { id: "nikah", label: "Nikah", icon: "☪️", defaultHours: 4 },
// ] as const;

// Other Functions
// export const OTHER_FUNCTIONS = [
//   { id: "birthday", label: "Birthday", icon: "🎂", defaultHours: 4 },
//   { id: "anniversary", label: "Anniversary", icon: "❤️", defaultHours: 4 },
//   { id: "baptism", label: "Baptism", icon: "⛪", defaultHours: 3 },
//   { id: "newborn", label: "Newborn Photography", icon: "👶", defaultHours: 2 },
//   { id: "neouluettu", label: "Neouluettu", icon: "🎭", defaultHours: 4 },
// ] as const;

// export const ADDITIONAL_FUNCTION_TYPES = [
//   { id: "haldi", label: "Haldi", defaultHours: 3, icon: "✨" },
//   { id: "mehendi", label: "Mehendi", defaultHours: 4, icon: "🌿" },
//   { id: "sangeet", label: "Sangeet", defaultHours: 5, icon: "🎶" },
//   { id: "ring-ceremony", label: "Ring Ceremony", defaultHours: 2, icon: "💍" },
//   { id: "tilak", label: "Tilak Ceremony", defaultHours: 2, icon: "🙏" },
// ] as const;

export const ALBUM_TYPES = [
  { value: 'one-photobook', label: 'One Photo-Book', recommended: true },
  { value: 'two-individual-photobooks', label: 'Two Individual Photo-Books' }
] as const

// export const COMPLIMENTARY_ITEMS = [
//   {
//     value: "mini-photo-book",
//     label: "Mini Photo Book",
//     description: "Compact 20-page photo book with highlights",
//     icon: "BookOpen",
//   },
//   {
//     value: "table-top-calendar",
//     label: "Table Top Calendar",
//     description: "12-month desk calendar with your best shots",
//     icon: "Calendar",
//   },
//   {
//     value: "photo-frames",
//     label: "Photo Frames",
//     description: "Set of 3 premium frames with best shots",
//     icon: "Frame",
//   },
// ] as const;

// export const VIDEO_ADDONS = [
//   { value: 'highlight-video', label: 'Highlight Video', description: '3-5 minute cinematic highlight reel', price: 5000 },
//   { value: 'full-ceremony', label: 'Full Ceremony Recording', description: 'Complete unedited recording', price: 8000 },
//   { value: 'same-day-edit', label: 'Same Day Edit', description: 'Quick edit delivered during event', price: 15000 },
//   { value: 'drone-coverage', label: 'Drone Coverage', description: 'Aerial photography and videography', price: 12000 }
// ] as const

// Pricing configuration
export const PRICING_CONFIG = {
  extraPhotographerCost: 8000,
  extraCinematographerCost: 12000,
  albumPagesIncrement: 10,
  albumPagesCost: 500, // per 10 pages
  advancePercentage: 30, // 30% advance required
} as const

// Wizard steps configuration
export const WIZARD_STEPS = [
  { number: 1, title: 'Client & Event Basics', path: '/wizard/step-1' },
  { number: 2, title: 'Event Summary', path: '/wizard/step-2' },
  { number: 3, title: 'Albums & Add-ons', path: '/wizard/step-3' },
  { number: 4, title: 'Package & Price', path: '/wizard/step-4' },
  { number: 5, title: 'Review & Confirm', path: '/wizard/step-5' }
] as const

export const TOTAL_STEPS = WIZARD_STEPS.length