# The Poke Haus — Website (v5)
Exact logo colors applied.
Palette → bg:#191970, panel:#202020, ink:#fefefe, muted:#848484, accent:#2a75ba, accent2:#981111, accent3:#171717

## High‑Value Singles Calculator ($5+)
- New page: `sell-high.html`
- Uses `/api/tcg` proxy to fetch TCGplayer Market Price.
- Payout tiers (per card): High 80% • Medium 70% • Low 60% (based on sales velocity).

### Deploy a Proxy (choose one)
**Cloudflare Worker**
1) `wrangler secret put TCGPLAYER_PUBLIC`
2) `wrangler secret put TCGPLAYER_PRIVATE`
3) Deploy the `api/cloudflare-worker.js` as a Worker at `/api/tcg`.
4) Update your Pages/Routes to forward `/api/*` to the Worker.

**Netlify Function**
1) Add env vars in Netlify: `TCGPLAYER_PUBLIC`, `TCGPLAYER_PRIVATE`
2) Deploy `api/netlify-function.js` as a function at `/api/tcg`.

### TCGplayer API Keys
- Sign up: https://developer.tcgplayer.com/
- Use OAuth client credentials to get a bearer token (already in examples).

### Frontend Behavior
- Ignores cards under $5 market.
- Condition multipliers: NM 1.00, LP 0.92, MP 0.85
- If velocity meta missing, defaults to 70%.
- Inquiry posts to Formspree with line breakdown and total.

