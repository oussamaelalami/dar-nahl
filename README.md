# Dar Nahl — Moroccan Honey Store

A bilingual (French / Arabic) e-commerce storefront for a Moroccan honey seller, built with Next.js 14, Supabase, and Tailwind CSS.

- Public storefront: product listing, product details, shopping cart, order placement
- Protected admin dashboard: order management, product management
- Demo mode: runs fully without a database using built-in mock data

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom honey/cream design tokens |
| UI Components | Radix UI + shadcn-style wrappers |
| Animations | Framer Motion |
| Internationalisation | next-intl (FR + AR, RTL auto-detected) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## Project Structure

```
storev2/
├── app/
│   ├── api/orders/          # Order API routes
│   ├── api/products/        # Product API routes
│   └── [locale]/
│       ├── admin/           # Protected admin pages
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── orders/
│       │   └── products/
│       ├── products/        # Public product pages
│       └── order/           # Checkout flow
├── components/
│   ├── admin/               # AdminSidebar, OrdersTable, ProductForm …
│   ├── client/              # Navbar, Hero, CartContext, LanguageSwitcher …
│   └── ui/                  # Reusable Radix UI wrappers
├── lib/
│   ├── demo-data.ts         # Mock data (used when Supabase is not configured)
│   ├── supabase/            # Browser + server Supabase clients
│   └── validations.ts       # Zod schemas
├── messages/
│   ├── fr.json              # French translations
│   └── ar.json              # Arabic translations
├── supabase/
│   └── schema.sql           # DB schema, RLS policies, seed data
├── types/index.ts
├── middleware.ts             # Locale routing + admin auth guard
└── tailwind.config.ts       # Honey-themed design system
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- npm 9+ (or pnpm / yarn)
- A free [Supabase](https://supabase.com) account (optional — app runs in demo mode without it)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd storev2
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **No Supabase yet?** Skip this step. The app runs in **demo mode** using `lib/demo-data.ts` — all UI features work, but data is read-only and not persisted.

### 3. Set up the Supabase database (skip in demo mode)

1. Go to your Supabase project → **SQL Editor**
2. Paste and run the contents of `supabase/schema.sql`

This creates:
- `products` table (bilingual FR/AR fields, categories, stock)
- `orders` table (customer info, JSONB items, status enum)
- Row Level Security policies
- 6 pre-seeded honey products

### 4. Create an admin user (skip in demo mode)

In your Supabase dashboard:
**Authentication → Users → Add User** — enter an email and password.

These credentials are used to log in at `/fr/admin/login`.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/fr` by default.

| Route | Description |
|-------|-------------|
| `/fr` or `/ar` | Public storefront |
| `/fr/products` | Product listing |
| `/fr/order` | Checkout |
| `/fr/admin/login` | Admin login |
| `/fr/admin/dashboard` | Admin dashboard (requires auth) |

---

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)

### 3. Add environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### 4. Deploy

Click **Deploy**. Vercel builds and publishes the app. All future pushes to `main` trigger automatic redeployments.

---

## Supabase Production Checklist

Before going live, verify the following in your Supabase project:

- [ ] `schema.sql` has been run (tables + RLS policies exist)
- [ ] At least one admin user exists under Authentication → Users
- [ ] RLS is **enabled** on both `products` and `orders` tables
- [ ] Your Vercel domain is allowed under **Authentication → URL Configuration → Redirect URLs** (e.g. `https://your-app.vercel.app/**`)
- [ ] Product images are stored in Supabase Storage or a CDN (URLs set in the `image_url` column)

---

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server locally
npm run lint     # ESLint check
```

---

## Internationalisation

The app supports **French** (`fr`) and **Arabic** (`ar`). Arabic activates automatic RTL layout.

- Translation files: `messages/fr.json` and `messages/ar.json`
- Add a new locale by updating `i18n/routing.ts` and adding a new `messages/<locale>.json` file
- The language switcher is in the navbar (`components/client/LanguageSwitcher.tsx`)

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Supabase anon/public key |

*Without these, the app runs in demo mode with read-only mock data.
