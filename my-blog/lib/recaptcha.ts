// ─── reCAPTCHA VERIFICATION ──────────────────────────────────────
// Google reCAPTCHA v3 integration for bot detection.
// Verifies that the user is human by checking the token sent from the client.
// Uses the secret key from environment variables (RECAPTCHA_SECRET_KEY).
// Score threshold: 0.5 (scores below this are considered suspicious).

'use server';

// Google reCAPTCHA secret key from environment variables.
// Used to verify the token sent from the client.
// Never expose this key on the client side.
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

// ─── VERIFY RECAPTCHA TOKEN ──────────────────────────────────────
// Sends a POST request to Google's reCAPTCHA API to verify the token.
// Steps:
//   1. If no token provided → returns false (verification fails).
//   2. Sends the token and secret key to Google's API.
//   3. Checks the response:
//      - success: true and score >= 0.5 → return true (human).
//      - success: false or score < 0.5 → return false (bot).
//   4. Handles fetch errors gracefully (returns false on failure).
export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    // Score threshold: 0.5 means "likely human"
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}