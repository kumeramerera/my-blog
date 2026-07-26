'use server';

import { db } from '@/db';
import { likes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Toggle like (like if not liked, unlike if already liked)
export async function toggleLike(postId: number) {
  const session = await auth();
  
  if (!session || !session.user?.id) {
    throw new Error('You must be logged in to like posts');
  }

  const userId = parseInt(session.user.id);

  // Check if the user already liked this post
  const existingLike = await db.query.likes.findFirst({
    where: and(
      eq(likes.postId, postId),
      eq(likes.userId, userId)
    ),
  });

  if (existingLike) {
    // Unlike: Remove the like
    await db.delete(likes)
      .where(and(
        eq(likes.postId, postId),
        eq(likes.userId, userId)
      ));
  } else {
    // Like: Add a new like
    await db.insert(likes).values({
      postId,
      userId,
    });
  }

  // Revalidate the page to update the like count
  revalidatePath('/blog');
  revalidatePath(`/blog/*`);
}

// Get like count for a post
export async function getLikeCount(postId: number) {
  const result = await db.select({ count: db.$count(likes) })
    .from(likes)
    .where(eq(likes.postId, postId));
  
  return result[0]?.count || 0;
}

// Check if current user liked a post
export async function getUserLike(postId: number) {
  const session = await auth();
  
  if (!session || !session.user?.id) {
    return false;
  }

  const userId = parseInt(session.user.id);

  const like = await db.query.likes.findFirst({
    where: and(
      eq(likes.postId, postId),
      eq(likes.userId, userId)
    ),
  });

  return !!like;
}