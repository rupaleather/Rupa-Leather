/* ============================================
   ORDER API — KULIT NUSANTARA
   Secure API route for order processing
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/security';
import { validateCheckoutForm, sanitizeInput, type CheckoutData } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
        { status: 429 }
      );
    }

    // Parse and validate
    const body = await request.json();
    const sanitized: CheckoutData = {
      name: sanitizeInput(body.name || ''),
      email: sanitizeInput(body.email || ''),
      phone: sanitizeInput(body.phone || ''),
      address: sanitizeInput(body.address || ''),
      city: sanitizeInput(body.city || ''),
      postalCode: sanitizeInput(body.postalCode || ''),
      notes: sanitizeInput(body.notes || ''),
    };

    const errors = validateCheckoutForm(sanitized);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validasi gagal', details: errors }, { status: 400 });
    }

    // In production: save to database, send email, etc.
    const orderId = `KN-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Pesanan berhasil diterima',
    });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
