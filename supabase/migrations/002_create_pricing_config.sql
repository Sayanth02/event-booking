-- Create pricing_config table
CREATE TABLE IF NOT EXISTS pricing_config (
  config_key TEXT PRIMARY KEY,
  config_value NUMERIC NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create updated_at trigger for pricing_config
CREATE TRIGGER update_pricing_config_updated_at
  BEFORE UPDATE ON pricing_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default pricing configuration values
INSERT INTO pricing_config (config_key, config_value, description) VALUES
  ('extra_crew_flat_fee', 8000, 'Flat fee per extra crew member (photographer or cinematographer)'),
  ('tax_percentage', 0, 'Tax percentage to apply on subtotal (0 = no tax)'),
  ('advance_percentage', 30, 'Advance payment percentage of total price')
ON CONFLICT (config_key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pricing_config
  FOR SELECT
  USING (is_active = true);

-- Create policy to allow authenticated users to manage (optional, for admin)
CREATE POLICY "Allow authenticated insert" ON pricing_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON pricing_config
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete" ON pricing_config
  FOR DELETE
  TO authenticated
  USING (true);
