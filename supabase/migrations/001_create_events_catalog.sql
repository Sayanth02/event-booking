-- Create events_catalog table
CREATE TABLE IF NOT EXISTS events_catalog (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('main', 'other', 'additional')),
  default_hours INTEGER NOT NULL CHECK (default_hours > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_events_catalog_category ON events_catalog(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_catalog_updated_at
  BEFORE UPDATE ON events_catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert main functions
INSERT INTO events_catalog (id, label, icon, category, default_hours) VALUES
  ('engagement', 'Engagement', '💍', 'main', 8),
  ('wedding', 'Wedding', '👰', 'main', 8),
  ('wedding-engagement', 'Wedding and Engagement', '💒', 'main', 10),
  ('reception', 'Reception', '🎊', 'main', 6),
  ('nikah', 'Nikah', '☪️', 'main', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert other functions
INSERT INTO events_catalog (id, label, icon, category, default_hours) VALUES
  ('birthday', 'Birthday', '🎂', 'other', 4),
  ('anniversary', 'Anniversary', '❤️', 'other', 4),
  ('baptism', 'Baptism', '⛪', 'other', 3),
  ('newborn', 'Newborn Photography', '👶', 'other', 2),
  ('neouluettu', 'Neouluettu', '🎭', 'other', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert additional functions
INSERT INTO events_catalog (id, label, icon, category, default_hours) VALUES
  ('haldi', 'Haldi', '✨', 'additional', 3),
  ('mehendi', 'Mehendi', '🌿', 'additional', 4),
  ('sangeet', 'Sangeet', '🎶', 'additional', 5),
  ('ring-ceremony', 'Ring Ceremony', '💍', 'additional', 2),
  ('tilak', 'Tilak Ceremony', '🙏', 'additional', 2)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE events_catalog ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON events_catalog
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update (optional, for admin)
CREATE POLICY "Allow authenticated insert" ON events_catalog
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON events_catalog
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete" ON events_catalog
  FOR DELETE
  TO authenticated
  USING (true);
