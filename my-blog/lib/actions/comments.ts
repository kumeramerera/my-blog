'use server';

import { db } from '@/db';
import { comments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { verifyRecaptcha } from '@/lib/recaptcha';

// ─── TYPES ────────────────────────────────────────────────────────

type CommentWithReplies = {
  id: number;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  parentId: number | null;
  approved: boolean;
  author: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
  replies: CommentWithReplies[];
};

// ─── SPAM PREVENTION ────────────────────────────────────────────

// In-memory rate limiter: tracks comments per IP address
const commentRateLimit = new Map<string, { count: number; resetAt: number }>();

// List of spam keywords to block
const spamPhrases = ['buy', 'click here', 'discount', 'offer', 'free money', 'viagra', 'casino', 'loan'];
const maxCommentsPerHour = 5;

// ─── CREATE COMMENT ────────────────────────────────────────────

export async function createComment(formData: FormData) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error('You must be logged in to comment');
  }

  // Verify reCAPTCHA
  const recaptchaToken = formData.get('recaptchaToken') as string;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    throw new Error('Bot detection failed. Please try again.');
  }

  const userId = parseInt(session.user.id);
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  // Rate limiting: max 5 comments per hour per IP
  const ipKey = `comment-${ip}`;
  const now = Date.now();
  const existing = commentRateLimit.get(ipKey);

  if (existing) {
    if (existing.count >= maxCommentsPerHour && now < existing.resetAt) {
      throw new Error(`Too many comments. Please wait ${Math.ceil((existing.resetAt - now) / 60000)} minutes.`);
    }
    if (now >= existing.resetAt) {
      commentRateLimit.set(ipKey, { count: 1, resetAt: now + 60 * 60 * 1000 });
    } else {
      commentRateLimit.set(ipKey, { count: existing.count + 1, resetAt: existing.resetAt });
    }
  } else {
    commentRateLimit.set(ipKey, { count: 1, resetAt: now + 60 * 60 * 1000 });
  }

  const postId = parseInt(formData.get('postId') as string);
  const content = formData.get('content') as string;
  const parentId = formData.get('parentId') as string | null;

  if (!content || content.trim().length === 0) {
    throw new Error('Comment cannot be empty');
  }

  // Block links
  if (content.includes('http://') || content.includes('https://')) {
    throw new Error('Links are not allowed in comments');
  }

  // Block spam phrases
  if (spamPhrases.some(phrase => content.toLowerCase().includes(phrase))) {
    throw new Error('Your comment contains spam-like content');
  }

  await db.insert(comments).values({
    content: content.trim(),
    postId,
    authorId: userId,
    parentId: parentId ? parseInt(parentId) : null,
    approved: false, // Requires admin approval
  });

  revalidatePath(`/blog/*`);
}

// ─── GET APPROVED COMMENTS ─────────────────────────────────────

export async function getComments(postId: number): Promise<CommentWithReplies[]> {
  // Fetch only approved comments
  const allComments = await db.query.comments.findMany({
    where: (comments, { eq, and }) =>
      and(
        eq(comments.postId, postId),
        eq(comments.approved, true)
      ),
    with: {
      author: {
        columns: { id: true, name: true, email: true },
      },
    },
    orderBy: (comments, { asc }) => [asc(comments.createdAt)],
  });

  // Build nested reply tree
  const commentMap: Record<number, CommentWithReplies> = {};
  const rootComments: CommentWithReplies[] = [];

  allComments.forEach((comment) => {
    commentMap[comment.id] = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt || null,
      updatedAt: comment.updatedAt || null,
      parentId: comment.parentId || null,
      approved: comment.approved || false,
      author: comment.author || null,
      replies: [],
    };
  });

  allComments.forEach((comment) => {
    const commentWithReplies = commentMap[comment.id];
    if (comment.parentId && commentMap[comment.parentId]) {
      commentMap[comment.parentId].replies.push(commentWithReplies);
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

// ─── EDIT COMMENT ──────────────────────────────────────────────

export async function editComment(commentId: number, content: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error('You must be logged in to edit comments');
  }

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.authorId !== parseInt(session.user.id)) {
    throw new Error('You can only edit your own comments');
  }

  if (!content || content.trim().length === 0) {
    throw new Error('Comment cannot be empty');
  }

  await db.update(comments)
    .set({
      content: content.trim(),
      updatedAt: new Date(),
    })
    .where(eq(comments.id, commentId));

  revalidatePath(`/blog/*`);
}

// ─── DELETE COMMENT ────────────────────────────────────────────

export async function deleteComment(commentId: number) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error('You must be logged in to delete comments');
  }

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.authorId !== parseInt(session.user.id)) {
    throw new Error('You can only delete your own comments');
  }

  await db.delete(comments).where(eq(comments.id, commentId));

  revalidatePath(`/blog/*`);
}

// ─── APPROVE COMMENT ────────────────────────────────────────────

export async function approveComment(commentId: number) {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error('Unauthorized');
  }

  const ADMIN_EMAIL = 'kumeramerera10@gmail.com';

  if (session.user.email !== ADMIN_EMAIL) {
    throw new Error('Only admin can approve comments');
  }

  await db.update(comments)
    .set({ approved: true })
    .where(eq(comments.id, commentId));

  revalidatePath(`/blog/*`);
}

// ─── GET PENDING COMMENTS ──────────────────────────────────────

export async function getPendingComments() {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error('Unauthorized');
  }

  const ADMIN_EMAIL = 'kumeramerera10@gmail.com';

  if (session.user.email !== ADMIN_EMAIL) {
    throw new Error('Only admin can view pending comments');
  }

  return await db.query.comments.findMany({
    where: (comments, { eq }) => eq(comments.approved, false),
    with: {
      author: {
        columns: { id: true, name: true, email: true },
      },
      post: {
        columns: { id: true, title: true },
      },
    },
    orderBy: (comments, { asc }) => [asc(comments.createdAt)],
  });
}