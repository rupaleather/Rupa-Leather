import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/dashboard/profile/password
 * Mengubah password user di Supabase Auth
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, oldPassword, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email dan password baru wajib diisi' }, { status: 400 });
    }

    // Catatan: Di Supabase client sisi server (dengan service role key), 
    // kita bisa mengupdate user berdasarkan ID atau Email.
    
    // 1. Cari user di auth.users berdasarkan email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const targetUser = userData.users.find(u => u.email === email);
    if (!targetUser) {
      return NextResponse.json({ 
        error: 'Update password gagal: Akun login (Auth) untuk email ini belum terdaftar.' 
      }, { status: 404 });
    }

    // 2. Update password menggunakan Admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      { password: newPassword }
    );

    if (updateError) throw updateError;

    return NextResponse.json({ 
      message: 'Kata sandi berhasil diperbarui' 
    });
  } catch (error: any) {
    console.error('Password Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
