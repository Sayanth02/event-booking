# Booking Validation Rules

## Required Fields

These fields **must** be provided when creating a booking:

### Client Information
- ✅ `client_name` - Full name (string, not empty)
- ✅ `client_phone` - Phone number (string, not empty)

### Event Details
- ✅ `booking_type` - Type of event (string, not empty)
- ✅ `event_date` - Event date (date format)

### Functions & Crew
- ✅ `selected_functions` - Array of selected functions (must have at least 1 function)
- ✅ `total_photographers` - Number (can be 0)
- ✅ `total_cinematographers` - Number (can be 0)

### Album Configuration
- ✅ `album_type` - Album type (string, not empty)
- ✅ `album_pages` - Number of pages (number)

### Pricing
- ✅ `total_price` - Total price (number)
- ✅ `advance_amount` - Advance payment (number)
- ✅ `balance_amount` - Balance amount (number)

### Terms & Signature
- ✅ `digital_signature` - Client signature (string, not empty)
- ✅ `terms_accepted` - Must be true (boolean)

---

## Optional Fields

These fields are **optional** and can be omitted or empty:

### Client Information
- ⚪ `client_whatsapp` - WhatsApp number
- ⚪ `client_email` - Email address
- ⚪ `client_home_address` - Home address
- ⚪ `client_current_location` - Current location

### Event Details
- ⚪ `event_location` - Event venue/location
- ⚪ `guest_count` - Number of guests
- ⚪ `budget_range` - Budget range

### Functions & Add-ons
- ⚪ `additional_functions` - Array of additional functions (can be empty)
- ⚪ `video_addons` - Array of video add-ons (can be empty)
- ⚪ `complimentary_item` - Complimentary item selection

### Package
- ⚪ `selected_package` - Package name
- ⚪ `selected_package_id` - Package ID

### Pricing Details
- ⚪ `pricing_breakdown` - Detailed pricing breakdown (JSONB)

### Crew Timing
- ⚪ `main_event_start_time` - Start time
- ⚪ `main_event_end_time` - End time

---

## Validation Logic

### API Endpoint (`/api/bookings`)

```typescript
// Required fields check
const requiredFields = [
  'client_name',
  'client_phone',
  'booking_type',
  'event_date',
  'selected_functions',
  'album_type',
  'album_pages',
  'total_price',
  'advance_amount',
  'balance_amount',
  'digital_signature',
  'terms_accepted',
];

// Validation rules:
// - undefined or null → Missing
// - Empty string (after trim) → Missing
// - Empty array for selected_functions → Missing
// - 0 for numbers → Valid (allowed)
```

### Database Constraints

```sql
-- NOT NULL constraints (required in database)
client_name TEXT NOT NULL
client_phone TEXT NOT NULL
booking_type TEXT NOT NULL
event_date DATE NOT NULL
selected_functions JSONB NOT NULL DEFAULT '[]'::jsonb
album_type TEXT NOT NULL
album_pages INTEGER NOT NULL
total_price NUMERIC NOT NULL
advance_amount NUMERIC NOT NULL
balance_amount NUMERIC NOT NULL
digital_signature TEXT NOT NULL
terms_accepted BOOLEAN NOT NULL DEFAULT false

-- Nullable fields (optional in database)
client_whatsapp TEXT
client_email TEXT
client_home_address TEXT
client_current_location TEXT
event_location TEXT
guest_count TEXT
budget_range TEXT
additional_functions JSONB NOT NULL DEFAULT '[]'::jsonb
video_addons JSONB NOT NULL DEFAULT '[]'::jsonb
complimentary_item TEXT
selected_package TEXT
selected_package_id TEXT
pricing_breakdown JSONB
main_event_start_time TEXT
main_event_end_time TEXT
```

---

## Error Messages

### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required fields: client_name, client_phone"
}
```

### Terms Not Accepted
```json
{
  "success": false,
  "error": "Terms and conditions must be accepted"
}
```

### Empty Selected Functions
```json
{
  "success": false,
  "error": "Missing required fields: selected_functions"
}
```

---

## Frontend Validation

### Step 5 (Review & Confirm)

```typescript
// Before submission
if (!termsAccepted) {
  alert("Please accept the terms and conditions");
  return;
}

if (!digitalSignature.trim()) {
  alert("Please provide your digital signature");
  return;
}
```

### Store Validation

The Zustand store should ensure:
- `selectedFunctions` has at least 1 function before reaching Step 5
- `clientInfo.fullName` and `clientInfo.phone` are filled in Step 1
- `eventDetails.bookingType` and `eventDetails.eventDate` are filled in Step 1
- `albumConfig.type` and `albumConfig.pages` are set in Step 3

---

## Examples

### Valid Booking (Minimal Required Fields)

```json
{
  "client_name": "John Doe",
  "client_phone": "9876543210",
  "booking_type": "Wedding",
  "event_date": "2025-12-15",
  "selected_functions": [
    {
      "id": "1",
      "functionId": "wedding",
      "name": "Wedding",
      "date": "2025-12-15",
      "startTime": "10:00",
      "endTime": "18:00",
      "duration": 8,
      "photographers": 2,
      "cinematographers": 2
    }
  ],
  "album_type": "one-photobook",
  "album_pages": 60,
  "total_price": 80000,
  "advance_amount": 24000,
  "balance_amount": 56000,
  "digital_signature": "John Doe",
  "terms_accepted": true
}
```

### Valid Booking (With Optional Fields)

```json
{
  "client_name": "John Doe",
  "client_phone": "9876543210",
  "client_whatsapp": "9876543210",
  "client_email": "john@example.com",
  "client_home_address": "123 Main St, Mumbai",
  "client_current_location": "Mumbai",
  "booking_type": "Wedding",
  "event_location": "Grand Hotel, Mumbai",
  "event_date": "2025-12-15",
  "guest_count": "200-300",
  "budget_range": "75000-100000",
  "selected_functions": [...],
  "additional_functions": [
    {
      "id": "2",
      "functionId": "mehendi",
      "name": "Mehendi",
      "date": "2025-12-14",
      "startTime": "14:00",
      "endTime": "18:00",
      "duration": 4,
      "photographers": 1,
      "cinematographers": 1
    }
  ],
  "album_type": "one-photobook",
  "album_pages": 80,
  "video_addons": ["teaser", "highlights"],
  "complimentary_item": "photoframe",
  "selected_package": "Premium Package",
  "selected_package_id": "pkg_premium",
  "total_price": 95000,
  "advance_amount": 28500,
  "balance_amount": 66500,
  "pricing_breakdown": {...},
  "digital_signature": "John Doe",
  "terms_accepted": true
}
```

### Invalid Booking (Missing Required Fields)

```json
{
  "client_name": "John Doe",
  // Missing: client_phone
  "booking_type": "Wedding",
  "event_date": "2025-12-15",
  "selected_functions": [],  // Empty array - invalid!
  "album_type": "one-photobook",
  "album_pages": 60,
  "total_price": 80000,
  "advance_amount": 24000,
  "balance_amount": 56000,
  "digital_signature": "",  // Empty string - invalid!
  "terms_accepted": false  // Must be true!
}

// Response:
{
  "success": false,
  "error": "Missing required fields: client_phone, selected_functions, digital_signature"
}
```

---

## Summary

### Always Required (12 fields)
1. client_name
2. client_phone
3. booking_type
4. event_date
5. selected_functions (at least 1)
6. album_type
7. album_pages
8. total_price
9. advance_amount
10. balance_amount
11. digital_signature
12. terms_accepted (must be true)

### Always Optional (14 fields)
1. client_whatsapp
2. client_email
3. client_home_address
4. client_current_location
5. event_location
6. guest_count
7. budget_range
8. additional_functions
9. video_addons
10. complimentary_item
11. selected_package
12. selected_package_id
13. pricing_breakdown
14. main_event_start_time
15. main_event_end_time

This ensures flexibility while maintaining data integrity for essential booking information.
