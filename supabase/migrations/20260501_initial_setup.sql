-- =============================================
-- INITIAL SCHEMA: Profiles, Business, Departments, Categories, and Regions
-- =============================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id    uuid UNIQUE,
  email           text UNIQUE NOT NULL,
  full_name       text,
  phone1          text,
  phone2          text,
  phone3          text,
  ktp             text,
  npwp            text,
  role            text DEFAULT 'admin',
  address         text,
  province        text,
  city            text,
  district        text,
  village         text,
  postal_code     text,
  avatar_url      text,
  is_active       boolean DEFAULT true,
  
  -- Business Info
  business_name        text,
  business_email       text,
  business_phone1      text,
  business_phone2      text,
  business_phone3      text,
  business_address     text,
  business_province    text,
  business_city       text,
  business_district   text,
  business_village    text,
  business_postal_code text,
  business_country     text DEFAULT 'Indonesia',
  business_logo_url    text,
  business_description text,
  business_website     text,
  business_industry    text,
  business_type        text,
  business_social_media jsonb DEFAULT '[]'::jsonb,
  
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  code            text UNIQUE,
  description     text,
  display_order   integer DEFAULT 0,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  description     text,
  display_order   integer DEFAULT 0,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 4. Regions Table (Placeholder for large dataset)
CREATE TABLE IF NOT EXISTS public.regions (
  id              bigserial PRIMARY KEY,
  provinsi        text,
  kota_kabupaten  text,
  kecamatan       text,
  kelurahan       text,
  kode_pos        text
);

-- 5. Helper Functions & Views
CREATE OR REPLACE VIEW public.distinct_provinces AS
SELECT DISTINCT provinsi FROM public.regions ORDER BY provinsi;

CREATE OR REPLACE FUNCTION public.get_cities(p_prov text)
RETURNS TABLE(kota_kabupaten text) AS $$
  SELECT DISTINCT kota_kabupaten FROM public.regions WHERE provinsi = p_prov ORDER BY kota_kabupaten;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.get_districts(p_prov text, p_city text)
RETURNS TABLE(kecamatan text) AS $$
  SELECT DISTINCT kecamatan FROM public.regions WHERE provinsi = p_prov AND kota_kabupaten = p_city ORDER BY kecamatan;
$$ LANGUAGE sql STABLE;

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Full access to profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Full access to departments" ON public.departments FOR ALL USING (true);
CREATE POLICY "Full access to categories" ON public.categories FOR ALL USING (true);

-- 8. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.departments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
