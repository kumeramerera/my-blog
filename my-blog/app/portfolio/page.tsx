import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Kumera Merera
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Portfolio Section */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Work</h1>
        <p className="text-lg text-gray-600 mb-12">
          Here are some projects I&apos;ve built. Each one showcases my skills in Next.js, PostgreSQL, and modern web development.
        </p>

        <div className="grid gap-8">
          {/* Project 1: This Blog */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">This Blog</h2>
            <p className="text-gray-600 mb-4">
              A full-stack blog platform with authentication, comments, likes, and an admin dashboard.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Next.js</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">TypeScript</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">PostgreSQL</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Tailwind CSS</span>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View Live →
            </Link>
          </div>

          {/* Project 2: Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Next.js E-Commerce</h2>
            <p className="text-gray-600 mb-4">
              An online store built with Next.js, Stripe, and Sanity CMS. (Coming soon)
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Next.js</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Stripe</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Sanity</span>
            </div>
            <span className="text-sm text-gray-400">In Development</span>
          </div>

          {/* Project 3: Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Management App</h2>
            <p className="text-gray-600 mb-4">
              A full-stack task manager with teams, comments, and real-time updates. (Coming soon)
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Next.js</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">WebSockets</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">PostgreSQL</span>
            </div>
            <span className="text-sm text-gray-400">In Development</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Have a Project in Mind?</h3>
          <p className="text-gray-600 mb-4">Let&apos;s build something great together.</p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Hire Me
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2026 Kumera Merera. Built with Next.js.
        </div>
      </footer>
    </div>
  );
}