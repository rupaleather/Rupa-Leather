import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/security';
import { validateEmail, sanitizeInput } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(`newsletter-${ip}`)) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan.' }, { status: 429 });
    }

    const body = await request.json();
    const email = sanitizeInput(body.email || '');
    const result = validateEmail(email);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // In production: save to mailing list service
    return NextResponse.json({ success: true, message: 'Berhasil berlangganan newsletter!' });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
