// ─── ROOT LAYOUT ──────────────────────────────────────────────────
// The root layout component that wraps all pages in the application.
// This is required by Next.js App Router.
// Features:
//   - Sets the HTML language and metadata
//   - Applies global fonts (Inter)
//   - Wraps the app with SessionProvider for authentication
//   - Imports global CSS styles (Tailwind)

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

// ─── METADATA ────────────────────────────────────────────────────
// Defines the default SEO metadata for all pages.
// Title: appears in the browser tab
// Description: used for search engines and social sharing
// Can be overridden by individual pages using `export const metadata`.
export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A blog built with Next.js, Drizzle, and PostgreSQL',
};

// ─── ROOT LAYOUT COMPONENT ──────────────────────────────────────
// Wraps the entire application.
// SessionProvider makes authentication data available to all client components.
// Children are the page components rendered by Next.js.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}