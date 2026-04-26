# LeasePilot — AI Lease Intelligence for Independent Landlords

Upload any lease PDF and instantly extract every critical date, clause, and obligation.
Never miss a renewal, rent escalation, or expiration again.

Built on Next.js 15 (App Router) + Supabase + Vercel + Resend + PostHog + Sentry (zero-cost free-tier stack).

## Stack

| Layer | Service | Free tier |
|-------|---------|-----------|
| Hosting | Vercel | 100 GB bandwidth / 100 K invocations |
| Database + Auth | Supabase | 500 MB, 50 K MAUs |
| Email | Resend | 3 000 emails/month |
| Analytics | PostHog | 1 M events/month |
| Error tracking | Sentry | 5 000 errors/month |

## Prerequisites

- Node 20+ and pnpm (`npm i -g pnpm`)
- A [Supabase](https://app.supabase.com) project
- A [Resend](https://resend.com) account with a verified sending domain
- A [PostHog](https://app.posthog.com) project
- A [Sentry](https://sentry.io) project
- A [Vercel](https://vercel.com) account

## Local development

```bash
# 1. Clone
git clone https://github.com/hunytalk/saas-starter.git
cd saas-starter

# 2. Install dependencies
pnpm install

# 3. Configure env vars
cp .env.example .env.local
# Edit .env.local and fill in all values (see table below)

# 4. Start dev server
pnpm dev
# → http://localhost:3000
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in every value.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret (server only) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sending address |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingest host (default: `https://app.posthog.com`) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN |
| `SENTRY_ORG` | Sentry org slug (CI source-map upload) |
| `SENTRY_PROJECT` | Sentry project slug (CI source-map upload) |
| `SENTRY_AUTH_TOKEN` | Sentry auth token (CI only) |
| `NEXT_PUBLIC_SITE_URL` | Public URL (set automatically on Vercel) |

## Auth flows

Supabase Auth handles all auth flows out of the box:

- **Sign up** → `/auth/sign-up`
- **Sign in** → `/auth/login`
- **Sign out** → server action in `AuthButton`
- **Forgot password** → `/auth/forgot-password`
- **Protected routes** → `/protected` (middleware-guarded)

## Smoke tests

```bash
# Resend — sends a test email
curl -X POST http://localhost:3000/api/email-test \
  -H 'Content-Type: application/json' \
  -d '{"to":"you@example.com"}'

# Sentry — captures a test error
curl http://localhost:3000/api/sentry-test
```

## Deploy to Vercel

```bash
# One-time setup (installs Vercel CLI)
pnpm add -g vercel

# Deploy (follows vercel.json)
vercel --prod
```

Set all environment variables in the Vercel project dashboard before the first deploy.
Supabase requires the production URL added to **Authentication → URL Configuration → Redirect URLs**.

## Waitlist

`POST /api/waitlist` accepts `{ "email": "user@example.com" }`, inserts into the
`waitlist` Supabase table, sends a welcome email via Resend, and fires a
`waitlist_signup_server` PostHog event.

Run the migration before first use:

```bash
# With Supabase CLI linked to your project
supabase db push
# or apply manually in the Supabase SQL editor:
# supabase/migrations/20260426000000_create_waitlist.sql
```

## Project structure

```
app/
  page.tsx       # LeasePilot landing page + waitlist CTA
  auth/          # Sign-up, sign-in, forgot-password, confirm flows
  protected/     # Example authenticated page
  api/
    waitlist/    # POST — email capture + Supabase insert + welcome email
    email-test/  # POST — Resend smoke test
    sentry-test/ # GET  — Sentry smoke test
components/
  waitlist-form.tsx     # Client-side form with PostHog analytics events
  posthog-provider.tsx  # Client-side PostHog init
lib/
  posthog.ts    # Server-side PostHog client
  resend.ts     # Resend client + sendTransactionalEmail helper
  supabase/     # Supabase SSR client helpers
supabase/
  migrations/   # SQL migrations (waitlist table + RLS)
sentry.*.config.ts  # Sentry instrumentation (client / server / edge)
next.config.ts      # Sentry build wrapper + Next.js config
vercel.json         # Vercel deploy settings
.env.example        # All required env vars documented
```
