'use client';

import { useState, useEffect, useRef } from 'react';
import { createComment } from '@/lib/actions/comments';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  postId: number;
  isLoggedIn: boolean;
  userName?: string | null;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function CommentForm({ postId, isLoggedIn, userName }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaLoaded = useRef(false);

  //  Move executeRecaptcha BEFORE the useEffect that calls it
  const executeRecaptcha = () => {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string, { action: 'comment' })
          .then((token: string) => {
            console.log(' reCAPTCHA token received');
            setRecaptchaToken(token);
          })
          .catch((error: Error) => {
            console.error('reCAPTCHA execution failed:', error);
          });
      });
    }
  };

  // Load reCAPTCHA script
  useEffect(() => {
    if (recaptchaLoaded.current) return;

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="recaptcha/api.js"]`);
    
    if (existingScript) {
      recaptchaLoaded.current = true;
      executeRecaptcha();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      recaptchaLoaded.current = true;
      executeRecaptcha();
    };

    return () => {
      const scriptElement = document.querySelector(`script[src*="recaptcha/api.js"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!content || content.trim().length === 0) {
      setError('Comment cannot be empty');
      return;
    }

    if (!recaptchaToken) {
      setError('Verification in progress. Please wait.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('postId', postId.toString());
    formData.append('content', content);
    formData.append('recaptchaToken', recaptchaToken);

    try {
      await createComment(formData);
      setContent('');
      executeRecaptcha();
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to post comment. Please try again.');
      }
      console.error('Comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>{' '}
          to leave a comment.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment as <span className="font-semibold">{userName || 'User'}</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Write your comment..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !recaptchaToken}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}