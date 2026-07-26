// ─── RATE LIMITING ────────────────────────────────────────────────
// Simple in-memory rate limiter to prevent spam and abuse.
// Tracks requests per IP address and blocks if the limit is exceeded.
// Currently used for comment submissions (5 per hour per IP).
// Note: In-memory storage resets on server restart.
// For production, consider using Redis or Upstash.

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new rate limiter that allows 5 requests per hour
export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// For IP-based rate limiting (without Redis)
// We'll use a simple in-memory store for development
export const ipRateLimit = new Map<string, { count: number; resetAt: number }>();