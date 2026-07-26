// ─── AUTHENTICATION ACTIONS ──────────────────────────────────────
// Server Actions for authentication-related operations.
// These functions are called directly from client components.
// Features:
//   - User registration with email/password
//   - Password hashing via bcrypt
//   - reCAPTCHA verification to prevent bot registrations
//   - Database insertion of new users

'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { verifyRecaptcha } from '@/lib/recaptcha';

type RegisterState = {
  error?: string;
  success?: boolean;
};

// ─── REGISTER ─────────────────────────────────────────────────────
// Handles new user registration.
// Steps:
//   1. Verifies reCAPTCHA token (prevents bot registration)
//   2. Validates required fields (email, name, password)
//   3. Hashes the password using bcrypt (10 rounds)
//   4. Inserts the user into the database
//   5. Returns success or error message
// Errors: duplicate email, missing fields, bot detection failure
export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;
  const recaptchaToken = formData.get('recaptchaToken') as string;

  // ─── reCAPTCHA VERIFICATION ──────────────────────────────────────
  // Validates the reCAPTCHA token sent from the client.
  // If the token is invalid, the registration is rejected.
  // This prevents automated bot registration.
  // Uses the secret key from environment variables.
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return { error: 'Bot detection failed. Please try again.' };
  }

  if (!email || !name || !password) {
    return { error: 'All fields are required' };
  }

  // ─── PASSWORD HASHING ────────────────────────────────────────────
  // Hashes the password using bcrypt with 10 salt rounds.
  // The hashed password is stored in the database.
  // Plain text password is never stored.
  // bcrypt is a one-way hashing algorithm (cannot be reversed).
  const hashedPassword = await bcrypt.hash(password, 10);

  // ─── DATABASE INSERT ─────────────────────────────────────────────
  // Inserts the new user into the users table.
  // Fields: email, name, hashedPassword
  // On duplicate email: catches the error and returns a friendly message.
  // On success: returns success: true to trigger redirect.
  try {
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Email already exists' };
  }

  return { success: true };
}