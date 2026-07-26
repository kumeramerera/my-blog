# My Blog — A Full-Stack Platform

A production-ready blog platform built with Next.js, Drizzle ORM, PostgreSQL, and Auth.js.

## Quick Links

- Live Demo: [coming soon]
- GitHub: https://github.com/kumeramerera/my-blog
- Author: Kumera Merera

---

## Features

- Authentication: Email/Password, Google OAuth, GitHub OAuth
- Blog Posts: Create, edit, delete, publish/unpublish
- Comments: Nested replies, edit/delete own comments
- Likes: Like posts and individual comments
- Spam Prevention: Rate limiting (5/hour), spam filter, reCAPTCHA v3
- Admin Dashboard: Manage posts and moderate comments
- Security: Secret admin URL + IP whitelisting
- User Experience: Reading time, share buttons, back to top

---

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Database: PostgreSQL + Drizzle ORM
- Authentication: Auth.js (NextAuth)
- Styling: Tailwind CSS
- Security: reCAPTCHA v3, bcrypt
- Deployment: Vercel

---

## Installation

### Prerequisites

- Node.js 18.18.0 or higher
- PostgreSQL 16 or higher

### Steps

1. Clone the repository
   git clone https://github.com/kumeramerera/my-blog.git
   cd my-blog

2. Install dependencies
   npm install

3. Set up environment variables
   cp .env.example .env.local
   Edit .env.local with your values

4. Set up the database
   npx drizzle-kit push

5. Run the development server
   npm run dev

---

## Environment Variables

DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/blogdb"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key"
RECAPTCHA_SECRET_KEY="your-secret-key"

Never commit .env.local to version control.

---

## Project Structure

my-blog/
├── app/                      # Next.js App Router
│   ├── api/auth/[...nextauth]/ # Auth.js routes
│   ├── blog/                   # Blog pages
│   ├── my-super-secret-dashboard/ # Admin dashboard
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   └── page.tsx                # Homepage
├── components/               # React components
├── db/                       # Database schema + connection
├── lib/                      # Server actions + utilities
├── types/                    # TypeScript definitions
└── proxy.ts                  # Middleware (security)

---

## About the Author

Hi, I'm Kumera Merera — a full-stack developer passionate about building modern web applications.

- Email: kumeramerera10@gmail.com
- GitHub: https://github.com/kumeramerera
- LinkedIn: https://linkedin.com/in/kumera-merera-1205a1424

I'm available for freelance work. Let's build something great together.

---

## License

MIT — Free to use, modify, and distribute.

---

## Support

If you found this project helpful, please give it a star on GitHub.