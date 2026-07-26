'use server';

import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

// Get all published posts
export async function getPublishedPosts() {
  return await db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.published, true),
    with: {
      author: {
        columns: { id: true, name: true, email: true },
      },
    },
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });
}

// Get single post by slug
export async function getPostBySlug(slug: string) {
  return await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.slug, slug),
    with: {
      author: {
        columns: { id: true, name: true, email: true },
      },
      comments: {
        with: {
          author: {
            columns: { id: true, name: true },
          },
        },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
}

// Get all posts (for admin)
export async function getAllPosts() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return await db.query.posts.findMany({
    with: {
      author: {
        columns: { id: true, name: true },
      },
    },
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });
}

// Create new post
export async function createPost(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const published = formData.get('published') === 'true';

  if (!title || !slug || !content) {
    return { error: 'Title, slug, and content are required' };
  }

  //  Get the author ID from the session
  const authorId = parseInt(session.user?.id || '0');

  //  Debug: Log the author ID
  console.log('Author ID:', authorId);
  console.log('Session user:', session.user);

  if (authorId === 0) {
    return { error: 'Invalid user ID. Please log out and log back in.' };
  }

  try {
    await db.insert(posts).values({
      title,
      slug,
      content,
      excerpt,
      published,
      authorId,
    });
  } catch (err) {
    console.error('Create post error:', err);
    return { error: `Database error: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }

  revalidatePath('/blog');
  revalidatePath('/');
  return { success: true };
}

// Update post
export async function updatePost(id: number, formData: FormData) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const published = formData.get('published') === 'true';

  if (!title || !slug || !content) {
    return { error: 'Title, slug, and content are required' };
  }

  try {
    await db.update(posts)
      .set({
        title,
        slug,
        content,
        excerpt,
        published,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));
  } catch (err) {
    console.error('Update post error:', err);
    return { error: 'Update failed. Slug might already exist.' };
  }

  revalidatePath('/blog');
  revalidatePath('/');
  revalidatePath(`/blog/${slug}`);
  redirect('/my-super-secret-dashboard');
}

// Delete post
export async function deletePost(id: number) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath('/blog');
  revalidatePath('/');
}