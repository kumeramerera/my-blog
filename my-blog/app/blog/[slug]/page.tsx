import { getPostBySlug } from '@/lib/actions/posts';
import { getLikeCount, getUserLike } from '@/lib/actions/likes';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import LikeButton from '@/components/LikeButton';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import BackToTop from '@/components/BackToTop';
import ShareButtons from '@/components/ShareButtons';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const session = await auth();
  const isLoggedIn = !!session;
  const likeCount = await getLikeCount(post.id);
  const userLiked = isLoggedIn ? await getUserLike(post.id) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container-custom py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">My Blog</span>
          </Link>
          {isLoggedIn ? (
            <span className="text-sm text-gray-600">
              Welcome, {session.user?.name || 'User'}!
            </span>
          ) : (
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Sign In
            </Link>
          )}
          {/* Hire Me Button */}
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Hire Me
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container-custom py-8">
        <div className="card p-8">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6">
            ← Back to Home
          </Link>

          <article>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span>By {post.author?.name || 'Unknown'}</span>
              <span>•</span>
              <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
              <span>•</span>
              {/* ─── READING TIME ──────────────────────────────
                  Calculates estimated reading time based on word count.
                  Formula: word count / 200 (average reading speed).
                  Math.ceil() rounds up to the nearest minute.
              */}
              <span>{Math.ceil(post.content.split(/\s+/).length / 200)} min read</span>
            </div>

            {/* Like Button */}
            <div className="flex items-center gap-4 mb-6">
              <LikeButton
                postId={post.id}
                initialLiked={userLiked}
                initialCount={likeCount}
                isLoggedIn={isLoggedIn}
              />
            </div>

            {/* Share Buttons */}
            <ShareButtons title={post.title} slug={post.slug} />

            {/* Content */}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>
          </article>

          {/* Comments */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <div className="mb-8">
              <CommentForm
                postId={post.id}
                isLoggedIn={isLoggedIn}
                userName={session?.user?.name ?? undefined}
              />
            </div>
            <CommentList postId={post.id} />
          </div>
        </div>

        {/* About the Author */}
        <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with initials */}
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
            KM
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">Kumera Merera</h3>
            <p className="text-sm text-gray-500 mb-2">Full-Stack Developer</p>
            <p className="text-sm text-gray-600">
              I build custom blogs, websites, and full-stack applications with Next.js,
              PostgreSQL, and modern tools. Available for freelance work.
            </p>
            <Link href="/contact" className="inline-block mt-2 text-blue-600 hover:underline text-sm font-medium">
              Hire Me →
            </Link>
          </div>
        </div>

        {/* Hire Me Section */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need a Custom Blog or Website?</h3>
          <p className="text-gray-600 mb-4">
            I build full-stack applications with Next.js, PostgreSQL, and modern tools.
          </p>
          <Link href="/contact" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Hire Me
          </Link>
        </div>
      </main>

      <BackToTop />

      {/* FOOTER */}
      <footer className="border-t border-gray-200 mt-12 bg-white">
        <div className="container-custom py-8 text-center text-sm text-gray-500">
          © 2026 My Blog. Built with Next.js
        </div>
      </footer>
    </div>
  );
}