import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http')

if (typeof window !== 'undefined') {
  console.log('Supabase Browser Config:', {
    url: isUrlValid ? supabaseUrl : 'INVALID URL',
    hasAnonKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 5) : 'NONE'
  });
}

// Server client (untuk API routes) — menggunakan Service Role Key
export const supabase = createClient(
  isUrlValid ? supabaseUrl : 'https://placeholder-project.supabase.co',
  supabaseServiceKey || supabaseAnonKey || 'dummy-key'
)

// Browser client (untuk login di sisi klien) — menggunakan Anon Key
export const supabaseBrowser = createClient(
  isUrlValid ? supabaseUrl : 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'dummy-key'
)
