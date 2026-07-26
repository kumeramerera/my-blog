'use client';

import { useState } from 'react';
import { toggleCommentLike } from '@/lib/actions/commentLikes';
import { useRouter } from 'next/navigation';

interface CommentLikeButtonProps {
  commentId: number;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}

export default function CommentLikeButton({
  commentId,
  initialLiked,
  initialCount,
  isLoggedIn
}: CommentLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await toggleCommentLike(commentId);
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    } catch (error) {
      console.error('Error toggling comment like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1 text-xs transition ${liked
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-gray-600'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span>
        {liked ? (
          <svg className="w-4 h-4 text-red-500 inline" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </span>
      <span>{count > 0 && count}</span>
    </button>
  );
}