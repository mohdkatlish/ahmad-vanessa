# Launching ahmad-vanessa.com on Cloudflare

The site is one **Cloudflare Worker** named `ahmad-vanessa`. It serves the static Astro build (`dist/`) and handles the contact form at `POST /api/contact`. Form messages are delivered by **Cloudflare Email Routing**, and spam is blocked by **Cloudflare Turnstile**.

```
Browser ──► Worker "ahmad-vanessa"
              ├─ /api/contact  → worker/contact.ts → Turnstile check → Email Routing → mohdnkatlish@gmail.com
              └─ everything else → static files from dist/ (+ _redirects, _headers, 404.html)
```

---

## Status

| | Step | Where |
|---|---|---|
| ✅ | Impressum address filled in | `src/data/legal.ts` |
| ✅ | Form recipient set (`MAIL_TO = mohdnkatlish@gmail.com`) | `wrangler.jsonc` |
| ✅ | Turnstile widget created, site key in the code | `src/data/site.ts` |
| ⬜ | 1. Connect the GitHub repo to Cloudflare | dashboard |
| ⬜ | 2. Store the Turnstile **secret** | dashboard |
| ⬜ | 3. Enable Email Routing and verify the inbox | dashboard |
| ⬜ | 4. Test on the `…workers.dev` preview link | browser |
| ⬜ | 5. Switch the domain from Hostinger to the Worker | dashboard |
| ⬜ | 6. Redirect `www` to the main domain | dashboard |
| ⬜ | 7. Final checks, then cancel Hostinger | Terminal / browser |

---

## 1. Connect the repo (automatic deploy on every push)
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → `mohdkatlish/ahmad-vanessa`.
2. Settings:
   - Project name: `ahmad-vanessa` (must match `name` in `wrangler.jsonc`)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`
3. **Deploy.** The Node version (22) comes from `.node-version`.

If the deploy fails with an error about **email / send_email**, do step 3 first and deploy again (Workers & Pages → ahmad-vanessa → Deployments → **Retry**).

## 2. Store the Turnstile secret
Worker **ahmad-vanessa** → **Settings** → **Variables and Secrets** → **Add**:
- Type **Secret**, name `TURNSTILE_SECRET`, value = the secret key from Cloudflare → Turnstile → your widget.

Never put the secret in the code: the repo is public. Until this is set, the form rejects every message.

## 3. Email Routing (so messages arrive)
1. **ahmad-vanessa.com** → **Email** → **Email Routing** → **Enable**. Cloudflare adds the MX and SPF records. The domain had no email before, so nothing breaks.
2. **Destination addresses** → add `mohdnkatlish@gmail.com` → open the verification email → **Verify**.
3. **Routing rules** → **Create address**: `kontakt` → **Send to** `mohdnkatlish@gmail.com`.
   This makes `kontakt@ahmad-vanessa.com` (the sender of the form mails and the address in the Impressum) a real, working address.

## 4. Test on the preview link
Workers & Pages → **ahmad-vanessa** → **Visit** opens `https://ahmad-vanessa.<account>.workers.dev`.
- All pages should work there.
- The **form only works on the real domain**: Turnstile and the Worker only accept `ahmad-vanessa.com` and `www.ahmad-vanessa.com`. To test the form on the preview link, temporarily add the `…workers.dev` hostname to the Turnstile widget (Turnstile → widget → Hostnames) **and** to `TURNSTILE_HOSTNAMES` in `wrangler.jsonc`, then remove it again.

## 5. Switch the domain
1. **ahmad-vanessa.com** → **DNS** → **Records**: delete the old `A` / `AAAA` / `CNAME` records for `ahmad-vanessa.com` and `www` that point to Hostinger. Keep the **MX** and **TXT** records from Email Routing.
2. Worker **ahmad-vanessa** → **Settings** → **Domains & Routes** → **Add** → **Custom domain**: `ahmad-vanessa.com`. Repeat for `www.ahmad-vanessa.com`.
   Cloudflare creates the DNS records and the SSL certificate automatically (usually a few minutes).
3. Leftover settings from the WordPress era, under **ahmad-vanessa.com** → **Speed** / **Rules** / **Caching**:
   - **Rocket Loader: off.** It rewrites scripts and can break Turnstile and the animations.
   - **Cache Rules / Page Rules** made for WordPress (e.g. "cache everything", `/wp-admin` bypass): delete them.
   - **Development Mode: off.**

## 6. Redirect www → main domain
**ahmad-vanessa.com** → **Rules** → **Overview** → **Create rule** → **Redirect Rule** → template **"Redirect from WWW to root"** → **Deploy**.
This way there's only one address, which is better for search engines. The pages already point search engines to `https://ahmad-vanessa.com/` via their canonical tags.

## 7. Final checks
```bash
curl -I https://ahmad-vanessa.com/                 # 200, and no "x-powered-by: PHP" header any more
curl -I https://www.ahmad-vanessa.com/             # 301 → https://ahmad-vanessa.com/
curl -I https://ahmad-vanessa.com/home/            # 301 → /
curl -I https://ahmad-vanessa.com/gibts-nicht/     # 404
curl -X GET https://ahmad-vanessa.com/api/contact  # 405 (only POST is allowed)
```
- Send a real message through https://ahmad-vanessa.com/kontakt/. It should arrive at mohdnkatlish@gmail.com, sent from `kontakt@ahmad-vanessa.com`; pressing *Reply* answers the visitor directly.
- Send an email to `kontakt@ahmad-vanessa.com` from another account. It should arrive in the same Gmail.
- Worker logs: **ahmad-vanessa** → **Observability** → **Logs**. Problems show up as `send_email failed` or `Turnstile rejected`.
- Google Search Console (optional): add the domain and submit `https://ahmad-vanessa.com/sitemap-index.xml`.
- Once everything works: keep a backup of the WordPress site (All-in-One WP Migration export), then cancel Hostinger.

---

## Local development
| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server at http://localhost:4321. Fast editing, but the form API isn't available. |
| `npm run preview:cf` | Builds and runs the real Worker at http://localhost:8787, including the form. |

In `preview:cf`, settings come from `.dev.vars` (not committed): Cloudflare's Turnstile test secret, which always passes, and `TURNSTILE_HOSTNAMES=example.com`, the hostname the test key reports. Emails are **not** sent: Wrangler writes them as `.eml` files under `.wrangler/tmp/email/` and prints the path.

Create `.dev.vars` on a new computer:
```
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
TURNSTILE_HOSTNAMES=example.com
```

---

## Where to change things
| What | File |
|---|---|
| Title, intro text, order button, footer | `src/data/site.ts` |
| Reading dates (archive) | `src/data/events.ts` |
| Author bios and links | `src/data/authors.ts` |
| Reader quotes | `src/data/testimonials.ts` |
| Instagram posts | `src/data/instagram.ts` |
| Press links | `src/data/media.ts` |
| 3D book dimensions / spine photo | `src/data/book.ts` |
| Impressum / Datenschutz details | `src/data/legal.ts` (texts: `src/pages/impressum.astro`, `src/pages/datenschutz.astro`) |
| Form recipient, allowed hostnames | `wrangler.jsonc` → `vars` |
| Form logic / email format | `worker/contact.ts` |
| Redirects from old URLs, HTTP headers | `public/_redirects`, `public/_headers` |

> The Impressum and Datenschutzerklärung are carefully written templates based on what this site actually does. They are **not legal advice**. If anything changes (e.g. you add analytics or a newsletter), update the privacy policy. You can check it against a generator such as e-recht24.de, or with a lawyer.
