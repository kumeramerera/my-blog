// ─── COMMENT LIKE ACTIONS ─────────────────────────────────────────
// Server actions for liking/unliking individual comments.
// Each user can like a comment only once (enforced by unique constraint).
// Actions: toggle like, get like count, check user like status.

'use server';

import { db } from '@/db';
import { commentLikes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// ─── TOGGLE COMMENT LIKE ──────────────────────────────────────────
// Toggles a like on a comment.
// If the user already liked it → removes the like (unlike).
// If the user hasn't liked it → adds a new like.
// Returns nothing — revalidates the page to update the UI.
export async function toggleCommentLike(commentId: number) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error('You must be logged in to like comments');
  }

  const userId = parseInt(session.user.id);

  // Check if the user already liked this comment.
  // If existingLike exists → remove it (unlike).
  // If not → insert a new like record.
  const existingLike = await db.query.commentLikes.findFirst({
    where: and(
      eq(commentLikes.commentId, commentId),
      eq(commentLikes.userId, userId)
    ),
  });

  if (existingLike) {
    // Unlike: Remove the like
    await db.delete(commentLikes)
      .where(and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, userId)
      ));
  } else {
    // Like: Add a new like
    await db.insert(commentLikes).values({
      commentId,
      userId,
    });
  }

  revalidatePath(`/blog/*`);
}

// ─── GET COMMENT LIKE COUNT ──────────────────────────────────────
// Returns the total number of likes for a specific comment.
// Used to display the like count next to the like button.
export async function getCommentLikeCount(commentId: number) {
  const result = await db.select({ count: db.$count(commentLikes) })
    .from(commentLikes)
    .where(eq(commentLikes.commentId, commentId));

  return result[0]?.count || 0;
}

// ─── GET USER COMMENT LIKE STATUS ────────────────────────────────
// Checks if the current logged-in user has liked a specific comment.
// Returns true if liked, false otherwise.
// Used to set the initial state of the like button (heart filled or empty).
export async function getUserCommentLike(commentId: number) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return false;
  }

  const userId = parseInt(session.user.id);

  const like = await db.query.commentLikes.findFirst({
    where: and(
      eq(commentLikes.commentId, commentId),
      eq(commentLikes.userId, userId)
    ),
  });

  return !!like;
}