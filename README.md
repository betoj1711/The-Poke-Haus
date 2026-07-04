# The Poke Haus buyback platform

A mobile-first Next.js MVP for acquiring Pokémon card collections. It runs with local demo data and does not require API keys.

## Local setup

1. `npm install`
2. `cp .env.example .env.local`
3. `npm run dev`
4. Visit `http://localhost:3000`

Public routes include `/sell`, `/pricing`, `/how-it-works`, `/faq`, `/track`, and legal/support pages. Demo seller and admin workspaces are available at `/dashboard` and `/admin`.

## Supabase

Create a Supabase project, add the URL and keys to `.env.local`, then run `supabase/migrations/001_initial.sql` followed by `supabase/seed.sql`. The migration includes seller/admin roles and initial row-level security. The UI intentionally falls back to mock data until credentials are present.

Create a private Storage bucket named `buy-order-media`. Limit accepted types to images and video, and add policies that scope object paths to the authenticated seller ID.

## Vercel

Import the repository in Vercel, add the environment variables from `.env.example`, and deploy using the Next.js preset. Set the production Supabase Auth site URL and redirect allowlist to the Vercel domain.

## Future API TODO

- Wire Supabase Auth, database repositories, signed Storage uploads, and middleware route protection.
- Connect TCGplayer, eBay sold comps, and Pokémon metadata in `lib/services/market.ts`.
- Add seller-paid Shippo or EasyPost label checkout; never silently make shipping merchant-paid.
- Connect Resend templates in `lib/services/notifications.ts`.
- Add a payout provider for approved one-click payouts while preserving manual controls.
- Add eBay listing API support using the existing inventory CSV model.
- Add audit-grade package video retention rules, disputes, and notification preferences.

## Pricing invariant

Customer-facing final offers always pass through `customerFacingOffer()` and round down to a whole dollar. Decimal values remain available only for internal accounting.
