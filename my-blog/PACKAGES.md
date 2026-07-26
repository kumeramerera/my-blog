# Dependencies

This project uses the following packages:

---

## Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.10 | React framework with SSR, routing, and API routes |
| `react` | 19.x | UI library for building components |
| `react-dom` | 19.x | React rendering for the browser |

---

## Database

| Package | Version | Purpose |
|---------|---------|---------|
| `drizzle-orm` | latest | Type-safe ORM for PostgreSQL |
| `drizzle-kit` | latest | CLI tool for migrations and schema management |
| `pg` | latest | PostgreSQL driver for Node.js |

---

## Authentication

| Package | Version | Purpose |
|---------|---------|---------|
| `next-auth` | beta | Authentication library (Google, GitHub, Email) |
| `bcryptjs` | latest | Password hashing for email/password logins |

---

## Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `dotenv` | latest | Loads environment variables from `.env.local` |
| `date-fns` | latest | Date formatting and manipulation |

---

## Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/bcryptjs` | latest | TypeScript types for bcryptjs |
| `@types/node` | latest | TypeScript types for Node.js |
| `@types/pg` | latest | TypeScript types for pg |
| `@types/react` | latest | TypeScript types for React |
| `@types/react-dom` | latest | TypeScript types for React DOM |
| `eslint` | latest | Code linting |
| `eslint-config-next` | latest | Next.js ESLint rules |
| `tailwindcss` | latest | Utility-first CSS framework |
| `typescript` | latest | TypeScript compiler |

---

## Notes

- `drizzle-kit` is only needed for development (migrations)
- `date-fns` is used for "2 hours ago" style timestamps
- Database is **local PostgreSQL** (not Neon)