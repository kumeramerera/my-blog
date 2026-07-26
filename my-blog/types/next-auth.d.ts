// ─── NEXT-AUTH TYPE EXTENSIONS ──────────────────────────────────
// Extends the default NextAuth types to include custom fields.
// By default, NextAuth only provides `name`, `email`, and `image`.
// This adds:
//   - id: the user's database ID
//   - isAdmin: whether the user is an admin
//
// These types are used throughout the app for type safety:
//   - Session.user → used in client components via useSession()
//   - JWT → used in the auth callbacks (jwt, session, signIn)

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  }
}