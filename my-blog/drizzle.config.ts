// ─── DRIZZLE CONFIG ──────────────────────────────────────────────
// Configuration for Drizzle Kit (CLI tool for migrations).
// Used by commands like:
//   npx drizzle-kit push    → push schema changes to the database
//   npx drizzle-kit generate → generate migration files
//   npx drizzle-kit migrate  → run migrations
//
// The DATABASE_URL is read from .env.local.

import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './db/schema.ts',        // Where your schema is defined
  out: './db/migrations',          // Where migration files are generated
  dialect: 'postgresql',           // Database type
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,                   // Log detailed output
  strict: true,                    // Strict mode for better type safety
});