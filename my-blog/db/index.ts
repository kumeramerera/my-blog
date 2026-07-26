// ─── DATABASE CONNECTION ─────────────────────────────────────────
// This file sets up the connection to PostgreSQL using Drizzle ORM.
// The connection string is read from .env.local (DATABASE_URL).
//
// How it works:
//   1. dotenv loads environment variables from .env.local
//   2. Pool creates a connection pool to PostgreSQL
//   3. drizzle() wraps the pool with Drizzle's type-safe query builder
//   4. The schema is imported and passed to drizzle for type inference

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export { schema };