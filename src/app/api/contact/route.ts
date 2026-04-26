/* ============================================
   CONTACT API — KULIT NUSANTARA
   Secure API route for contact form
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/security';
import { validateEmail, validateRequired, sanitizeInput } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(`contact-${ip}`)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = sanitizeInput(body.name || '');
    const email = sanitizeInput(body.email || '');
    const message = sanitizeInput(body.message || '');

    const nameResult = validateRequired(name, 'Nama');
    const emailResult = validateEmail(email);
    const messageResult = validateRequired(message, 'Pesan');

    if (!nameResult.valid || !emailResult.valid || !messageResult.valid) {
      return NextResponse.json({
        error: 'Validasi gagal',
        details: {
          ...(nameResult.error && { name: nameResult.error }),
          ...(emailResult.error && { email: emailResult.error }),
          ...(messageResult.error && { message: messageResult.error }),
        },
      }, { status: 400 });
    }

    // In production: send email, save to DB, notify admin
    return NextResponse.json({ success: true, message: 'Pesan berhasil dikirim' });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
