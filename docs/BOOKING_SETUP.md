# Booking System Setup Guide

## Quick Start

### 1. Run Database Migration

You need to apply the booking table migration to your Supabase database.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/003_create_bookings.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`
7. Verify success message

#### Option B: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd eventbooking

# Push the migration
supabase db push

# Or if you need to link first
supabase link --project-ref your-project-ref
supabase db push
```

### 2. Verify Migration

Run this query in SQL Editor to verify:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'bookings';

-- Test booking reference generation
SELECT generate_booking_reference();

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
```

### 3. Test the System

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Complete a test booking:**
   - Navigate to `/wizard/step-1`
   - Fill in all steps
   - Submit booking on Step 5
   - Verify confirmation page shows booking reference

3. **Check database:**
   ```sql
   SELECT booking_reference, client_name, client_phone, 
          event_date, total_price, booking_status, payment_status
   FROM bookings
   ORDER BY created_at DESC
   LIMIT 5;
   ```

## Booking Reference Format

**Pattern:** `BK-YYYY-NNNN`

Examples:
- `BK-2025-0001` - First booking of 2025
- `BK-2025-0042` - 42nd booking of 2025

The reference auto-generates and increments for each year.

## API Endpoints

### Create Booking
```
POST /api/bookings
Content-Type: application/json

{
  "client_name": "John Doe",
  "client_phone": "9876543210",
  "booking_type": "Wedding",
  "event_location": "Mumbai",
  "event_date": "2025-12-15",
  "selected_functions": [...],
  "album_type": "one-photobook",
  "album_pages": 60,
  "total_price": 80000,
  "advance_amount": 24000,
  "balance_amount": 56000,
  "digital_signature": "John Doe",
  "terms_accepted": true
}
```

### Get Booking by Reference
```
GET /api/bookings?reference=BK-2025-0001
```

### Get Bookings by Phone
```
GET /api/bookings?phone=9876543210
```

## Status Values

### Booking Status
- `pending` - Initial status (default)
- `confirmed` - After advance payment
- `completed` - Event finished
- `cancelled` - Booking cancelled

### Payment Status
- `unpaid` - No payment (default)
- `advance_paid` - 30% advance paid
- `fully_paid` - Full payment received
- `refunded` - Payment refunded

## Troubleshooting

### Migration Fails

**Error: Function `update_updated_at_column()` does not exist**

This function should be created in migration `001_create_events_catalog.sql`. If it's missing, add it:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Booking Submission Fails

1. **Check Supabase connection:**
   - Verify `.env.local` has correct Supabase URL and key
   - Check browser console for errors

2. **Check required fields:**
   - All fields in API validation must be provided
   - Terms must be accepted

3. **Check RLS policies:**
   - Public insert policy should be enabled
   - Check Supabase logs for policy violations

### Booking Reference Not Generating

```sql
-- Test the function manually
SELECT generate_booking_reference();

-- Check if trigger exists
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'bookings';
```

## Environment Variables

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## Security Notes

### Row Level Security (RLS)

The bookings table has RLS enabled with these policies:

1. **Public Insert** - Anyone can create bookings (for customer submissions)
2. **Public Read** - Anyone can read bookings (for confirmation page)
3. **Authenticated Update/Delete** - Only authenticated users (admin panel)

### Future: Restrict Read Access

For production, you may want to restrict read access:

```sql
-- Drop public read policy
DROP POLICY "Allow users read own bookings" ON bookings;

-- Create restricted policy (only by phone or reference)
CREATE POLICY "Allow read own bookings" ON bookings
  FOR SELECT
  USING (
    client_phone = current_setting('request.headers')::json->>'x-client-phone'
    OR booking_reference = current_setting('request.headers')::json->>'x-booking-ref'
  );
```

## Data Backup

### Export Bookings

```sql
-- Export to CSV (in Supabase Dashboard)
SELECT * FROM bookings ORDER BY created_at DESC;
-- Click "Download as CSV"

-- Or use pg_dump
pg_dump -h your-db-host -U postgres -t bookings -d postgres > bookings_backup.sql
```

### Restore Bookings

```sql
-- Import from SQL file
\i bookings_backup.sql
```

## Monitoring

### Check Recent Bookings

```sql
SELECT 
  booking_reference,
  client_name,
  event_date,
  total_price,
  booking_status,
  payment_status,
  created_at
FROM bookings
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Count by Status

```sql
SELECT 
  booking_status,
  COUNT(*) as count,
  SUM(total_price) as total_revenue
FROM bookings
GROUP BY booking_status;
```

### Upcoming Events

```sql
SELECT 
  booking_reference,
  client_name,
  event_date,
  event_location,
  payment_status
FROM bookings
WHERE event_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  AND booking_status != 'cancelled'
ORDER BY event_date;
```

## Next Steps

After setup is complete:

1. ✅ Test booking submission
2. ✅ Verify data in database
3. ✅ Test confirmation page
4. 📋 Implement PDF generation (optional)
5. 📋 Add email notifications (optional)
6. 📋 Create admin dashboard (optional)
7. 📋 Integrate payment gateway (optional)

## Support

For issues or questions:
1. Check `BOOKING_SYSTEM_COMPLETE.md` for detailed documentation
2. Review Supabase logs in dashboard
3. Check browser console for client-side errors
4. Verify all migrations are applied correctly
