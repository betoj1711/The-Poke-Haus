# The Poke Haus — GitHub Pages Site (v2)

Static site for The Poke Haus (Pokémon TCG boutique, San Antonio TX).

## What’s Included
- **eBay feed** section that auto-loads latest listings from your store RSS (best effort; falls back to a link if blocked).
- Bulk estimate calculator + buy rate catalog
- Formspree inquiry form (estimate only): https://formspree.io/f/xovlbaob
- SEO (meta, OG/Twitter, JSON-LD)
- Social links (Instagram, TikTok, YouTube) + Google page link

## Deploy (GitHub Pages)
1. Upload everything in this folder to your repo `The-Poke-Haus` (branch: `main`).
2. Repo Settings → **Pages** → Source: `Deploy from a branch` → Branch: `main` → `/root`.
3. Wait a minute for GitHub Pages to publish.
4. Optional: Add your custom domain in Pages and set a CNAME.

## Editing
- **Rates:** `script.js` → edit the `catalog` array values.
- **Quick-view rates in hero:** Edit text in `index.html`.
- **Social links:** bottom of `index.html` under “Follow Us”.
- **Logo:** replace `assets/logo.png` (uses your provided logo).
- **Favicon:** replace `assets/favicon.png`.
- **eBay feed:** the RSS URL is set to `https://www.ebay.com/sch/thepokehaus28/m.html?_rss=1` in `script.js` (function `loadEbayFeed`).

## Notes
- Estimates are not binding; payouts finalized after inspection via PayPal G&S or cash/Venmo in person.
- Pokémon is a registered trademark of Nintendo / Creatures / GAME FREAK. This site is an independent reseller.
