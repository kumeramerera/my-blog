'use client';

import { useEffect } from 'react';

interface RecaptchaProps {
  onVerify: (token: string) => void;
  action: string;
}

// ─── GLOBAL TYPES ────────────────────────────────────────────────
// Declare grecaptcha so TypeScript knows it exists on the window.
// This comes from the Google reCAPTCHA script loaded in the page.
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function Recaptcha({ onVerify, action }: RecaptchaProps) {
  useEffect(() => {
    const execute = () => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string, { action })
          .then((token: string) => onVerify(token))
          .catch((error: Error) => console.error('reCAPTCHA execution failed:', error));
      });
    };

    // If grecaptcha is already loaded, execute immediately.
    // Otherwise, wait for it (check every 500ms).
    if (typeof window !== 'undefined' && window.grecaptcha) {
      execute();
    } else {
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && window.grecaptcha) {
          clearInterval(interval);
          execute();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [onVerify, action]);

  // This component renders nothing — it just runs the reCAPTCHA script.
  return null;
}