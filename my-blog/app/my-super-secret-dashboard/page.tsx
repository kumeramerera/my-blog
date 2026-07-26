// ─── ADMIN DASHBOARD ─────────────────────────────────────────────
// Main admin page for managing blog posts.
// Accessible only to the admin user (email match).
// Displays:
//   - Statistics (total posts, published, drafts)
//   - List of all posts with view and delete options
//   - Navigation to create new posts and moderate comments

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllPosts, deletePost } from '@/lib/actions/posts';
import Link from 'next/link';
import { signOut } from '@/lib/auth';

// Admin email address — only this user can access this page.
// Replace this with your own email.
const ADMIN_EMAIL = 'kumeramerera10@gmail.com';

export default async function AdminPage() {
  const session = await auth();

  // ─── AUTHENTICATION ──────────────────────────────────────────────
  // Verifies that the user is logged in and is the admin.
  // If not, redirects to the homepage.
  // This prevents unauthorized access to the admin dashboard.
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  // ─── FETCH POSTS ─────────────────────────────────────────────────
  // Retrieves all posts from the database (including drafts).
  // Ordered by creation date (newest first).
  // Used to display the post list on the dashboard.
  const posts = await getAllPosts();

  // ─── UI ──────────────────────────────────────────────────────────
  // Admin dashboard layout with:
  //   - Header: title, welcome message, action buttons
  //   - Stats: total, published, draft counts
  //   - Posts list: all posts with view/delete actions
  //   - Empty state: "Create your first post" when no posts exist
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {session.user?.name || 'User'}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/my-super-secret-dashboard/comments"
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition text-sm font-medium"
            >
              Moderate Comments
            </Link>
            <Link
              href="/my-super-secret-dashboard/posts/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-medium"
            >
              + New Post
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition text-sm font-medium">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-sm text-gray-500 font-medium">Total Posts</p>
            <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-sm text-gray-500 font-medium">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {posts.filter(p => p.published).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-sm text-gray-500 font-medium">Drafts</p>
            <p className="text-3xl font-bold text-yellow-600">
              {posts.filter(p => !p.published).length}
            </p>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Your Posts</h2>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-500 font-medium">No posts yet.</p>
              <Link
                href="/my-super-secret-dashboard/posts/new"
                className="inline-block mt-4 text-blue-600 hover:underline font-medium"
              >
                Create your first post →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {posts.map((post) => (
                <li key={post.id} className="px-6 py-5 hover:bg-gray-50 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                          {post.slug}
                        </span>
                        <span className="flex items-center gap-1">
                          {post.published ? (
                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                              Draft
                            </span>
                          )}
                        </span>
                        <span>
                          {new Date(post.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        View
                      </Link>
                      <span className="text-gray-300">|</span>
                      <form
                        action={async () => {
                          'use server';
                          await deletePost(post.id);
                          redirect('/my-super-secret-dashboard');
                        }}
                      >
                        <button
                          type="submit"
                          className="text-sm text-red-600 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}