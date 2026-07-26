// ─── GLOBAL TYPES ────────────────────────────────────────────────
// Extends the global Window interface to include grecaptcha.
// This tells TypeScript that `window.grecaptcha` exists and has
// the `ready` and `execute` methods from Google reCAPTCHA.
// Without this, TypeScript would throw errors when using grecaptcha.

export {};

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}