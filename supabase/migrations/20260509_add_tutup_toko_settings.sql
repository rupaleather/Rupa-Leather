-- Migration to add tutup_toko_settings column to outlets table
ALTER TABLE outlets ADD COLUMN IF NOT EXISTS tutup_toko_settings JSONB DEFAULT '{}'::jsonb;
