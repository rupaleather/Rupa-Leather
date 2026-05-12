/* ============================================
   SECURITY MIDDLEWARE — RUPA LEATHER
   Applied to UI routes for maximum security
   ============================================ */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECURITY_HEADERS } from '@/lib/constants';
import { getCSPHeader } from '@/lib/security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isDev = process.env.NODE_ENV === 'development';

  // 1. Jika ini request ke /api, berikan header dasar saja tanpa memaksa HTTPS (HSTS) atau CSP
  if (isApiRoute) {
    // Kita tetap tambahkan header dasar seperti anti-XSS atau nosniff
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // 2. Untuk halaman UI biasa, kita tambahkan semua security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Content Security Policy
  response.headers.set('Content-Security-Policy', getCSPHeader());

  // 3. Strict Transport Security (HSTS)
  // Hanya jalankan di production agar tidak error saat testing di localhost (HTTP)
  if (!isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|videos/).*)',
  ],
};
