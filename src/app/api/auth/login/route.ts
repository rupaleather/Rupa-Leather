import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    // Gunakan Anon Key untuk signInWithPassword (bukan Service Role Key)
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('SignIn Error:', signInError.message);
      return NextResponse.json(
        { error: 'Email atau kata sandi salah' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem: ' + error.message },
      { status: 500 }
    );
  }
}
