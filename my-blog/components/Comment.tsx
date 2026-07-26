'use client';

import { useState, useEffect } from 'react';
import { editComment, deleteComment, createComment } from '@/lib/actions/comments';
import { getCommentLikeCount, getUserCommentLike } from '@/lib/actions/commentLikes';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import CommentLikeButton from './CommentLikeButton';

const ADMIN_EMAIL = 'kumeramerera10@gmail.com';

// Define the Comment type
interface CommentType {
  id: number;
  content: string;
  createdAt: Date | null;
  updatedAt?: Date | null;
  author: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
  replies: CommentType[];
}

interface CommentProps {
  comment: CommentType;
  postId: number;
  userId?: number;
  isLoggedIn: boolean;
  depth?: number;
}

export default function Comment({
  comment,
  postId,
  userId,
  isLoggedIn,
  depth = 0
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const router = useRouter();

  // Fetch like data
  useEffect(() => {
    const fetchLikeData = async () => {
      const [count, liked] = await Promise.all([
        getCommentLikeCount(comment.id),
        isLoggedIn ? getUserCommentLike(comment.id) : Promise.resolve(false),
      ]);
      setLikeCount(count);
      setUserLiked(liked);
    };
    fetchLikeData();
  }, [comment.id, isLoggedIn]);

  const isOwner = userId === comment.author?.id;
  const maxDepth = 3;

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editComment(comment.id, editContent);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Edit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    setLoading(true);
    try {
      await deleteComment(comment.id);
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('postId', postId.toString());
      formData.append('content', replyContent);
      formData.append('parentId', comment.id.toString());

      await createComment(formData);
      setReplyContent('');
      setIsReplying(false);
      router.refresh();
    } catch (error) {
      console.error('Reply error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canReply = depth < maxDepth;
  const authorName = comment.author?.name || 'Anonymous';
  const authorInitial = authorName[0] || '?';

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-6 border-l-2 border-gray-200' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${comment.author?.email === ADMIN_EMAIL
                ? 'bg-yellow-600 text-white'
                : 'bg-blue-100 text-blue-600'
                }`}>
                {authorInitial}
              </div>

              <span className={`font-medium ${comment.author?.email === ADMIN_EMAIL
                ? 'text-yellow-600'
                : 'text-gray-900'
                }`}>
                {authorName}

                {/* Admin Badge */}
                {comment.author?.email === ADMIN_EMAIL && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-200">
                    Admin
                  </span>
                )}
              </span>

              <span className="text-xs text-gray-400">
                • {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'recently'}
              </span>
              {comment.updatedAt && (
                <span className="text-xs text-gray-400">
                  (edited)
                </span>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleEdit} className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-wrap items-center gap-3">
                {isLoggedIn && canReply && !isEditing && (
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Reply
                  </button>
                )}
                {isOwner && !isEditing && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Right side: Like button */}
              <CommentLikeButton
                commentId={comment.id}
                initialLiked={userLiked}
                initialCount={likeCount}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <form onSubmit={handleReply} className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${authorName}...`}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Post Reply
              </button>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              userId={userId}
              isLoggedIn={isLoggedIn}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}