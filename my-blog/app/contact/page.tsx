'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('kumeramerera10@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Kumera Merera
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let&apos;s Build Something Great</h1>
          <p className="text-xl text-blue-100">
            Have a project in mind? Let&apos;s talk.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Email Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6 hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
            <span className="text-gray-700 font-medium">kumeramerera10@gmail.com</span>
            <button
              onClick={copyEmail}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Email'}
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Connect</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://github.com/kumeramerera"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition"
            >
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.011-1.049-.017-2.058-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.235-3.221-.123-.3-.535-1.52.117-3.162 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.642.24 2.862.118 3.162.768.84 1.233 1.911 1.233 3.221 0 4.609-2.804 5.624-5.476 5.921.43.371.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.825.579 4.765-1.588 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-gray-700">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/kumera-merera-1205a1424"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition"
            >
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-gray-700">LinkedIn</span>
            </a>
            <a
              href="https://twitter.com/@kumeramerera11"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition"
            >
              <svg className="w-6 h-6 text-black-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-gray-700">Twitter</span>
            </a>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-medium text-gray-900">Reach Out</h3>
              <p className="text-sm text-gray-500">Send me an email or connect on social media</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-medium text-gray-900">Discuss</h3>
              <p className="text-sm text-gray-500">We&apos;ll talk about your project needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-medium text-gray-900">Build</h3>
              <p className="text-sm text-gray-500">I&apos;ll build and deliver your project</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2026 Kumera Merera. Built with Next.js.
          <div className="flex justify-center gap-6 mt-2">
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition">
              Twitter
            </a>
            <a href="https://github.com/kumeramerera" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition">
              GitHub
            </a>
            <Link href="/contact" className="hover:text-blue-600 transition text-blue-600 font-medium">
              Hire Me
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}