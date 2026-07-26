// ─── CREATE POST PAGE ────────────────────────────────────────────
// Admin-only page for creating new blog posts.
// Uses useActionState to handle form submission and state management.
// Features:
//   - Auto-generates slug from title (editable)
//   - Rich text input for post content
//   - Publish/unpublish toggle
//   - Redirects to admin dashboard after successful creation

'use client';

import { useActionState } from 'react';
import { createPost } from '@/lib/actions/posts';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// ─── INITIAL STATE ───────────────────────────────────────────────
// Defines the initial state for the useActionState hook.
// error: stores error messages from the server action
// success: indicates whether the post was created successfully
// Used to display error messages or trigger redirects.
const initialState: {
  error?: string;
  success?: boolean;
} = {};

export default function NewPostPage() {
  const [state, formAction] = useActionState(createPost, initialState);
  const router = useRouter();

  // ─── REDIRECT ON SUCCESS ────────────────────────────────────────
  // When the post is successfully created (state.success === true),
  // redirect the user back to the admin dashboard.
  useEffect(() => {
    if (state?.success) {
      router.push('/my-super-secret-dashboard');
    }
  }, [state?.success, router]);

  // ─── UTILITY FUNCTIONS ──────────────────────────────────────────
  // Generates a URL-friendly slug from the post title.
  // Replaces spaces and special characters with hyphens.
  // Example: "My Amazing Post!" → "my-amazing-post"
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // ─── UI ──────────────────────────────────────────────────────────
  // Displays a form with the following fields:
  //   - Title: required, auto-generates slug
  //   - Slug: URL-friendly version of the title (editable)
  //   - Excerpt: short summary (optional)
  //   - Content: main post body (required)
  //   - Published: checkbox to publish immediately
  // On submit: calls the createPost server action.
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <a
            href="/my-super-secret-dashboard"
            className="text-gray-600 hover:text-gray-800 hover:underline"
          >
            ← Back to Dashboard
          </a>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6 bg-white p-8 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="My Amazing Blog Post"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const slugInput = document.getElementById('slug') as HTMLInputElement;
                if (slugInput && !slugInput.dataset.manuallyEdited) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              required
              placeholder="my-amazing-blog-post"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={() => {
                const input = document.getElementById('slug') as HTMLInputElement;
                input.dataset.manuallyEdited = 'true';
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the title. Edit manually if needed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              rows={2}
              placeholder="A short summary of your post..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={12}
              placeholder="Write your blog post content here..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                value="true"
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Post
            </button>
            <a
              href="/my-super-secret-dashboard"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}