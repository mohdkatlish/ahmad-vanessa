# ahmad-vanessa.com

Website for the book **»Komm dahin, wo es still ist. Eine Erkundung«** by Vanessa Vu and Ahmad Katlesh (Rowohlt, 2024).

Built with [Astro](https://astro.build) as a static site, served by a Cloudflare Worker that also handles the contact form (Cloudflare Turnstile + Email Routing).

## Quick start

```sh
npm install
npm run dev          # http://localhost:4321
```

| Command | Action |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview:cf` | Build and run the real Worker locally (incl. contact form) at http://localhost:8787 |
| `npm run deploy` | Build and deploy to Cloudflare (needs `npx wrangler login`) |

Pushing to `main` deploys automatically once the repo is connected in Cloudflare.

## Structure

```text
src/
  data/        ← all texts, links and settings (edit these to change content)
  components/  ← page sections (Hero, Events, About, …)
  pages/       ← /, /kontakt/, /impressum/, /datenschutz/, 404
worker/        ← Cloudflare Worker: contact form endpoint
public/        ← favicon, robots.txt, _redirects, _headers
wrangler.jsonc ← Worker configuration
```

Setup, launch checklist and where to change what: see **[DEPLOY.md](DEPLOY.md)**.
