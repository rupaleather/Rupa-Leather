-- Create outlets table
CREATE TABLE IF NOT EXISTS outlets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  manager_name VARCHAR(255),
  manager_email VARCHAR(255),
  outlet_type VARCHAR(50) DEFAULT 'penjualan' CHECK (outlet_type IN ('penjualan', 'gudang')),
  status VARCHAR(20) DEFAULT 'buka' CHECK (status IN ('buka', 'tutup')),
  is_main_outlet BOOLEAN DEFAULT false,
  subscription_plan VARCHAR(50) DEFAULT 'TRIAL',
  expiry_date DATE,

  -- Contact
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),

  -- Address
  address TEXT,
  address_note TEXT,
  country VARCHAR(100) DEFAULT 'Indonesia',
  province VARCHAR(255),
  city VARCHAR(255),
  district VARCHAR(255),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,

  -- Logos
  logo_url TEXT,
  struk_logo_url TEXT,

  -- Social Media
  social_media JSONB DEFAULT '[]'::jsonb,

  -- Schedule (JSONB for flexible structure)
  schedule JSONB DEFAULT '{}'::jsonb,

  -- Store Closing
  close_store_enabled BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;

-- Allow full access (adjust based on your auth model)
CREATE POLICY "Allow full access to outlets" ON outlets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE outlets;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_outlets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER outlets_updated_at
  BEFORE UPDATE ON outlets
  FOR EACH ROW
  EXECUTE FUNCTION update_outlets_updated_at();
