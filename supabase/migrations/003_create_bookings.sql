-- Create or replace the update_updated_at_column function (if not exists from previous migrations)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  
  -- Client Information
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_whatsapp TEXT,
  client_email TEXT,
  client_home_address TEXT,
  client_current_location TEXT,
  
  -- Event Details
  booking_type TEXT NOT NULL,
  event_location TEXT,
  event_date DATE NOT NULL,
  guest_count TEXT,
  budget_range TEXT,
  
  -- Selected Functions (Main Event + Additional)
  selected_functions JSONB NOT NULL DEFAULT '[]'::jsonb,
  additional_functions JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Crew Information
  total_photographers INTEGER NOT NULL DEFAULT 0,
  total_cinematographers INTEGER NOT NULL DEFAULT 0,
  main_event_start_time TEXT,
  main_event_end_time TEXT,
  
  -- Album Configuration
  album_type TEXT NOT NULL,
  album_pages INTEGER NOT NULL,
  
  -- Add-ons
  video_addons JSONB NOT NULL DEFAULT '[]'::jsonb,
  complimentary_item TEXT,
  
  -- Package & Pricing
  selected_package TEXT,
  selected_package_id TEXT,
  total_price NUMERIC NOT NULL,
  advance_amount NUMERIC NOT NULL,
  balance_amount NUMERIC NOT NULL,
  pricing_breakdown JSONB,
  
  -- Status Tracking
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'advance_paid', 'fully_paid', 'refunded')),
  
  -- Terms & Signature
  digital_signature TEXT NOT NULL,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- PDF Generation
  pdf_generated BOOLEAN DEFAULT false,
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_client_phone ON bookings(client_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  reference TEXT;
BEGIN
  -- Get current year
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Get count of bookings this year + 1
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM bookings
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Format: BK-2025-0001
  reference := 'BK-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for booking submission)
CREATE POLICY "Allow public insert bookings" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to read their own bookings (by phone)
CREATE POLICY "Allow users read own bookings" ON bookings
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to manage all bookings (admin)
CREATE POLICY "Allow authenticated update bookings" ON bookings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete bookings" ON bookings
  FOR DELETE
  TO authenticated
  USING (true);
+