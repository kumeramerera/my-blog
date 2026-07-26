// ─── PROXY / MIDDLEWARE ─────────────────────────────────────────
// Runs on every request to protect the admin dashboard.
// Security layers:
//   1. Authentication: Redirects to login if not logged in
//   2. IP Whitelisting: Blocks access from unauthorized IPs
//
// The admin path is "/my-super-secret-dashboard" (obfuscated URL).
// Only requests matching this path are protected.

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// ─── CONFIGURATION ──────────────────────────────────────────────

// List of allowed IP addresses
// 127.0.0.1 = localhost (always allowed for development)
const ALLOWED_IPS = [
  '127.0.0.1',
  '196.188.188.137', // ← Replace with your actual public IP
];

// The secret admin path (obfuscated to hide it from attackers)
const ADMIN_PATH = '/my-super-secret-dashboard';

// ─── MIDDLEWARE ──────────────────────────────────────────────────

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith(ADMIN_PATH);

  // ─── IP WHITELISTING ──────────────────────────────────────────
  // Get the client's IP from headers (x-forwarded-for is set by proxies)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const userIP = forwardedFor ? forwardedFor.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  
  const isAllowedIP = ALLOWED_IPS.includes(userIP) || userIP === '127.0.0.1' || userIP === '::1';

  // Block if admin route and IP is not allowed
  if (isAdminRoute && !isAllowedIP) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // ─── AUTHENTICATION ────────────────────────────────────────────
  // Redirect to login if admin route and not logged in
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

// ─── MATCHER ─────────────────────────────────────────────────────
// Only run this middleware on admin routes and login page
export const config = {
  matcher: ['/my-super-secret-dashboard/:path*', '/login'],
};