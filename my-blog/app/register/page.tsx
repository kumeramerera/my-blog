// ─── REGISTER PAGE ───────────────────────────────────────────────
// Handles new user registration with email and password.
// Features:
//   - Form validation (name, email, password)
//   - reCAPTCHA v3 integration to prevent bot registrations
//   - Password hashing via bcrypt (server-side)
//   - Redirects to login page after successful registration
// Uses useActionState for form handling and state management.

'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type RegisterState = {
  error?: string;
  success?: boolean;
};

// ─── INITIAL STATE ───────────────────────────────────────────────
// Defines the initial state for the useActionState hook.
// error: stores error messages from the server action
// success: indicates whether registration was successful
// Used to display error messages or trigger redirects.
const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, initialState);
  const router = useRouter();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // ─── LOAD reCAPTCHA ──────────────────────────────────────────────
  // Dynamically loads the Google reCAPTCHA v3 script.
  // Executes reCAPTCHA on component mount to get a token.
  // The token is stored in state and submitted with the form.
  // Prevents bot registrations.
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string, { action: 'register' })
            .then((token: string) => {
              setRecaptchaToken(token);
            })
            .catch((error: Error) => {
              console.error('reCAPTCHA execution failed:', error);
            });
        });
      }
    };

    return () => {
      const scriptElement = document.querySelector(`script[src*="recaptcha/api.js"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  // ─── REDIRECT ON SUCCESS ─────────────────────────────────────────
  // When registration is successful (state.success === true),
  // redirect the user to the login page.
  useEffect(() => {
    if (state?.success) {
      router.push('/login');
    }
  }, [state, router]);

  // ─── UI ──────────────────────────────────────────────────────────
  // Displays a clean registration form with:
  //   - Name input field
  //   - Email input field
  //   - Password input field (min 6 characters)
  //   - Hidden recaptchaToken input
  //   - Submit button (disabled until recaptcha loads)
  //   - "Protected by reCAPTCHA" notice
  //   - Link to login page for existing users
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">Join the community</p>
          </div>

          {state?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>

            {/* Hidden input for recaptcha token */}
            <input type="hidden" name="recaptchaToken" value={recaptchaToken || ''} />

            <button
              type="submit"
              disabled={!recaptchaToken}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>

            <p className="text-xs text-gray-400 text-center mt-2">
              Protected by reCAPTCHA
            </p>
          </form>

          {/* Hire Me Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              Need a custom blog or website?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                Hire Me
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}