// ─── AUTH CONFIGURATION ───────────────────────────────────────────
// Auth.js (NextAuth) configuration for the blog.
// Providers:
//   - Google OAuth
//   - GitHub OAuth
//   - Email/Password (Credentials)
//
// Callbacks:
//   - jwt: stores user data in the JWT token
//   - session: adds user data to the session
//   - signIn: handles OAuth user creation
//
// Admin email is hardcoded to identify the blog owner.

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Admin email address — users with this email are treated as admin.
// Admin users:
//   - See the "Dashboard" link on the homepage
//   - Can access the admin dashboard
//   - Can approve/delete comments
// Replace this with your own email.
const ADMIN_EMAIL = 'kumeramerera10@gmail.com';

export const { handlers, signIn, signOut, auth } = NextAuth({

  // ─── PROVIDERS ────────────────────────────────────────────────────
  // Defines the authentication providers available:
  //   - Google: OAuth 2.0
  //   - GitHub: OAuth 2.0
  //   - Credentials: email/password (with bcrypt hashing)
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password!
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name || 'User',
          isAdmin: user.email === ADMIN_EMAIL,
        };
      },
    }),
  ],

  // ─── CALLBACKS ────────────────────────────────────────────────────
  // Auth.js callbacks that modify the authentication flow:
  //   - jwt: called when a JWT is created or updated
  //   - session: called when the session is read
  //   - signIn: called when a user signs in (handles OAuth user creation)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || 'User';
        token.isAdmin = user.isAdmin || user.email === ADMIN_EMAIL;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = (token.name as string) || 'User';
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },

    async signIn({ user, account }) {
      console.log(' signIn - user before:', user);

      if (account?.provider === 'google' || account?.provider === 'github') {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        console.log(' Existing user:', existingUser);

        if (!existingUser) {
          const result = await db.insert(users).values({
            email: user.email!,
            name: user.name || user.email!.split('@')[0],
            password: null,
          }).returning({ id: users.id });

          user.id = result[0].id.toString();
          user.name = user.name || user.email!.split('@')[0];
          console.log(' Created new user with ID:', user.id);
        } else {
          user.id = existingUser.id.toString();
          user.name = existingUser.name || existingUser.email.split('@')[0];
          console.log(' Found existing user with ID:', user.id);
        }
      }
      console.log(' signIn - user after:', user);
      return true;
    },
  },

  // ─── PAGES ────────────────────────────────────────────────────────
  // Custom pages for authentication flows.
  // Overrides the default Auth.js pages.
  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },
});