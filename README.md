# Lingora — Online Courses Webapp

Next.js (React) + Tailwind + Prisma + Auth.js + Stripe.

## Project structure

```
src/
  app/                 # Next.js routes (pages + thin API handlers)
  frontend/            # UI components & client hooks
    components/
    hooks/
  backend/             # Server-only logic
    auth/              # Auth.js config & session helpers
    db/                # Prisma client
    services/          # Courses, cart, orders, Stripe, certificates, tests
    actions/           # Server actions
prisma/                # Schema + seed
```

## Setup

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role    | Email                 | Password     |
|---------|-----------------------|--------------|
| Admin   | admin@lingora.test    | password123  |
| Student | student@lingora.test  | password123  |

## Environment

Copy `.env.example` to `.env`. Local defaults use SQLite and `DEV_BYPASS_PAYMENTS=true` so cart checkout unlocks courses without Stripe keys.

For real payments:

1. Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. Set `DEV_BYPASS_PAYMENTS=false`
3. Point Stripe webhook to `/api/webhooks/stripe`

For production Postgres, change `DATABASE_URL` and `provider` in `prisma/schema.prisma` to `postgresql`, then run `npx prisma db push`.

## Deploy (Vercel)

1. Push repo and import into Vercel
2. Set env vars (use Neon/Supabase Postgres URL)
3. Run migrations / `prisma db push` against production DB
4. Configure Stripe webhook to your production `/api/webhooks/stripe`

## Features

- Home, searchable courses, language tests
- Auth-gated cart + Stripe (or dev bypass) checkout
- Lesson player with Web Speech TTS
- Progress tracking + PDF certificates + public verify page
- Admin CRUD for courses, lessons, and tests
