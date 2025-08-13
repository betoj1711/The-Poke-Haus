# The Poke Haus — Website (v3)

Multi-page, friendly version for GitHub Pages.

## Pages
- `index.html` — Home (friendly hero, featured tiles, clear CTAs)
- `sell.html` — Smaller, collapsible calculator + Formspree inquiry + rates
- `shop.html` — Manual shop highlights + eBay link (reliable without CORS)
- `about.html` — Brand story & categories
- `contact.html` — Simple contact form (Formspree)
- `style.css` / `script.js` — styles & calculator logic
- `assets/` — logo, favicon, cover & feature images
- `CNAME` — sets custom domain www.thepokehaus.com

## Deploy on GitHub Pages
1. Push files to your repo (`The-Poke-Haus`) on branch `main`.
2. Settings → **Pages** → Source: `Deploy from a branch` → Branch: `main` → root `/`.
3. In **Custom domain**, enter **www.thepokehaus.com** (this will add a `CNAME` file).
4. Ensure DNS:
   - A @ → 185.199.108.153 / 109.153 / 110.153 / 111.153
   - CNAME www → betoj1711.github.io
5. After DNS resolves, enable **Enforce HTTPS**.

## Updating Content
- **Featured tiles**: `index.html` & `shop.html` (replace images/links).
- **Buy rates**: `script.js` (edit `catalog` array).
- **Formspree**: `sell.html` & `contact.html` (action attribute).
- **Socials**: footer links in `style` & page footers.
- **Brand images**: swap files in `assets/`.
