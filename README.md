# The Poke Haus

Conversion-focused storefront for The Poke Haus, a collector-run Pokémon TCG shop in San Antonio. The homepage sends buyers to the live eBay inventory while preserving the card buyback workflow as a secondary path.

## Local development

1. Install dependencies with `pnpm install`.
2. Start the site with `pnpm dev`.
3. Visit `http://localhost:3000`.

Run `pnpm build` before deployment.

## Live eBay inventory

The storefront displays verified current listings as a fallback. For automatic inventory, pricing, and availability updates, create an eBay Developer production keyset and add `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` to the Vercel project environment. Never expose the client secret in browser code.

## Website requests

Contact messages and sell-order submissions are delivered to `sell@thepokehaus.com` through Resend. Add `RESEND_API_KEY` and `EMAIL_FROM` in Vercel and verify the sending domain in Resend before launch.

## Main routes

- `/` — eBay-focused storefront
- `/sell` — card buy-order flow
- `/pricing` and `/how-it-works` — seller information
- `/faq`, `/contact`, and `/track` — customer support
- `/account` and `/dashboard` — seller workspace
- `/admin` — internal order and inventory views

## Deployment

The application is a Next.js project and can be deployed with Vercel's Next.js preset. `CNAME` records the production domain, `www.thepokehaus.com`.

The Supabase migration and seed files support the future authenticated seller/admin workflow. The current interface falls back to demo data until service credentials and repository adapters are connected.
