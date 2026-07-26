// ─── HOMEPAGE ─────────────────────────────────────────────────────
// The main landing page of the blog.
// Features:
//   - Hero section with tagline and call-to-action buttons
//   - Featured post (first published post)
//   - Recent posts grid (all published posts except featured)
//   - Authentication-aware header (shows user name, dashboard link, logout)
//   - Footer with social links and "Hire Me" call-to-action
// Data is fetched server-side using Server Components.

import { getPublishedPosts } from '@/lib/actions/posts';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth';

// Admin email address — used to determine if the logged-in user is the admin.
// Admin users see the "Dashboard" link in the header.
// Replace this with your own email.
const ADMIN_EMAIL = 'kumeramerera10@gmail.com'; // CHANGE THIS!

export default async function HomePage() {

  // ─── DATA FETCHING ───────────────────────────────────────────────
  // Fetches published posts from the database.
  // Only posts with published = true are displayed on the homepage.
  // The first post is featured; the rest are displayed in the grid.
  const posts = await getPublishedPosts();

  // ─── AUTHENTICATION ──────────────────────────────────────────────
  // Checks if the user is logged in and if they are the admin.
  // Used to conditionally render:
  //   - Welcome message with user name
  //   - Dashboard link (admin only)
  //   - Logout button
  const session = await auth();
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const featuredPost = posts.length > 0 ? posts[0] : null;

  // ─── UI ──────────────────────────────────────────────────────────
  // Homepage layout with:
  //   - Header: brand, navigation, user info, logout
  //   - Hero: tagline, CTA buttons (Read Articles, Hire Me)
  //   - Featured post: largest card with full excerpt
  //   - Recent posts: grid of post cards with title, excerpt, date
  //   - Footer: copyright, social links, Hire Me
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Brand Name - Always visible */}
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">Kumera Merera</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Blog
              </Link>
              <Link href="/portfolio" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Portfolio
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Contact
              </Link>
            </nav>
          </div>
          {isLoggedIn && (
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                Welcome, {session.user?.name || 'User'}!
              </p>
              <div className="mt-2 flex items-center justify-center gap-4">
                {isAdmin && (
                  <Link href="/my-super-secret-dashboard" className="text-sm text-blue-600 hover:underline">
                    Dashboard
                  </Link>
                )}
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}
                >
                  <button className="text-sm text-red-500 hover:text-red-600 transition">
                    Logout
                  </button>
                </form>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Sign in to comment and like posts</p>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Thoughts, Stories & Ideas
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mb-8">
            Exploring the intersection of technology, design, and everyday life.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/blog" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition shadow-lg">
              Read Articles
            </Link>
            {!isLoggedIn && (
              <Link href="/register" className="border border-white/30 text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition">
                Join the Community
              </Link>
            )}
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition">
              Hire Me
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED POST */}
      {featuredPost && (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4">Featured</span>
            <h2 className="text-3xl font-bold mb-2">
              <Link href={`/blog/${featuredPost.slug}`} className="hover:text-blue-600 transition">
                {featuredPost.title}
              </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By {featuredPost.author?.name || 'Unknown'}</span>
              <span>•</span>
              <span>{new Date(featuredPost.createdAt!).toLocaleDateString()}</span>
            </div>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Read More →
            </Link>
          </div>
        </section>
      )}

      {/* RECENT POSTS */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Recent Posts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.length === 0 ? (
            <p className="text-gray-500 col-span-2 text-center py-12">
              No posts yet. Check back soon!
            </p>
          ) : (
            posts.slice(1).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {post.author?.name || 'Unknown'}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 mt-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>© 2026 Kumera Merera. Built with Next.js.</span>
          <div className="flex gap-6">
            <a
              href="https://twitter.com/@kumeramerera11"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition"
            >
              Twitter
            </a>
            <a
              href="https://github.com/kumeramerera"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition"
            >
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