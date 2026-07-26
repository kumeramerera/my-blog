import { getPublishedPosts } from '@/lib/actions/posts';
import Link from 'next/link';
import BackToTop from '@/components/BackToTop';

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">All Posts</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600">{post.excerpt}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Hire Me Section */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need a Custom Blog or Website?</h3>
          <p className="text-gray-600 mb-4">
            I build full-stack applications with Next.js, PostgreSQL, and modern tools.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Hire Me
          </Link>
        </div>
      </main>

      <BackToTop />

    </div>
  );
}
