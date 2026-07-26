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

      {/* Hero */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Work</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Full-stack applications built with Next.js, TypeScript, and PostgreSQL.
          </p>
        </div>
      </section>

      {/* Project 1: This Blog */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl transition">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-full md:w-2/3">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Full-Stack Blog Platform</h2>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Live</span>
              </div>
              <p className="text-gray-600 mb-4">
                A complete blog with authentication, comments, likes, admin dashboard, and spam prevention.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Next.js</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">TypeScript</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">PostgreSQL</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Drizzle</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Tailwind CSS</span>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <a
                href="https://github.com/kumeramerera/my-blog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Live Demo
              </a>
            </div>
          </div>
        </div>

        {/* Project 2: Placeholder - Only if you have a second project */}
        {/* If you don't have a second project, remove this section */}

        <div className="mt-6 p-8 bg-white rounded-2xl shadow-md border border-gray-100 text-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">More Projects Coming</h3>
          <p className="text-gray-400 text-sm">
            I&apos;m currently building more projects. Check back soon or contact me to collaborate.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
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