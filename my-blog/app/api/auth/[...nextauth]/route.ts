// ─── AUTH.JS API ROUTE ──────────────────────────────────────────
// Handles all authentication requests (login, logout, OAuth callbacks, session).
// The [...nextauth] is a catch-all route for /api/auth/* endpoints.
// The actual logic is in lib/auth.ts — this file just exports the handlers.

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;