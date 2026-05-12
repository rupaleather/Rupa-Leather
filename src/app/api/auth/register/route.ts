import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, whatsapp } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Daftar ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone: whatsapp || '',
        }
      }
    });

    if (authError) {
      const message = authError.message === 'User already registered'
        ? 'Email sudah terdaftar. Silakan login.'
        : authError.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (authData.user) {
      // 2. Buat profil di tabel profiles (Optional, fail safe)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: email,
        phone1: whatsapp,
        role: 'user',
        is_active: true
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return NextResponse.json({
      message: 'Pendaftaran berhasil',
      user: authData.user
    });
    
  } catch (error: any) {
    console.error('Register Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem' },
      { status: 500 }
    );
  }
}
