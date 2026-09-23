# Deploying ahmad-vanessa.com to Cloudflare

The site is one **Cloudflare Worker**. It serves the static Astro build (`dist/`) and handles the contact form at `POST /api/contact`. Form messages are delivered by **Cloudflare Email Routing**, and spam is blocked by **Cloudflare Turnstile**.

```
Browser ──► Worker "ahmad-vanessa"
              ├─ /api/contact  → worker/contact.ts → Turnstile check → Email Routing → your inbox
              └─ everything else → static files from dist/ (+ _redirects, 404.html)
```

---

## Before the first deploy (one-time)

### 1. Fill in the legal details
Edit `src/data/legal.ts` and replace every `TODO` value: street, postal code and city. A publisher or "c/o" address is fine, but it can't be a P.O. box. `npm run build` prints a warning until this is done.

### 2. Turn on Email Routing (so you can receive mail)
1. Cloudflare dashboard → **ahmad-vanessa.com** → **Email** → **Email Routing** → **Get started / Enable**.
   Cloudflare adds the MX and SPF DNS records for you. The domain has no email today, so nothing breaks.
2. **Destination addresses** → **Add destination address**: the inbox that should receive messages (e.g. your Gmail). Open the verification email and click **Verify**.
3. **Routing rules** → **Create address**: `kontakt@ahmad-vanessa.com` → *Send to* → your verified inbox.
   This makes the address shown in the Impressum work too.

### 3. Create the Turnstile widget (spam protection)
1. Cloudflare dashboard → **Turnstile** → **Add widget**.
2. Name: `ahmad-vanessa kontakt`. Hostnames: `ahmad-vanessa.com` and `www.ahmad-vanessa.com`. Mode: **Managed**.
3. Copy the **Site key** into `src/data/site.ts` → `turnstileSiteKey` (it replaces the test key `1x00000000000000000000AA`).
4. Keep the **Secret key** for step 5. Never put it in the code.

### 4. Set the recipient in `wrangler.jsonc`
```jsonc
"vars": {
  "MAIL_FROM": "kontakt@ahmad-vanessa.com",
  "MAIL_TO": "your-verified-inbox@gmail.com",   // ← the address verified in step 2
  ...
}
```
Then run `npm run cf-typegen` to refresh the Worker types.

### 5. Log in and store the secret
```bash
cd site
npx wrangler login                          # opens the browser once
npx wrangler secret put TURNSTILE_SECRET    # paste the Turnstile secret key
```

---

## Deploy

### Option A: from your computer
```bash
npm run deploy        # = astro build && wrangler deploy
```

### Option B: automatic on every git push (recommended)
1. Push the `site/` folder to a GitHub repository.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → pick the repo.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/` (or `site` if the repo also contains other folders)
4. After the first build, open the Worker → **Settings** → **Variables and Secrets** and check that `TURNSTILE_SECRET` is there. If it isn't, add it as a **Secret**.

---

## Connect the domain
1. DNS (**ahmad-vanessa.com** → **DNS** → **Records**): **delete** the old `A`/`AAAA`/`CNAME` records for `ahmad-vanessa.com` and `www` that point to Hostinger.
   Leave the MX/TXT records that Email Routing created.
2. Worker **ahmad-vanessa** → **Settings** → **Domains & Routes** → **Add** → **Custom domain**:
   `ahmad-vanessa.com`, then again for `www.ahmad-vanessa.com`.
   Cloudflare creates the DNS records and the SSL certificate automatically (usually within a few minutes).

---

## Check that everything works
```bash
curl -I https://ahmad-vanessa.com/                 # 200, "server: cloudflare"
curl -I https://www.ahmad-vanessa.com/             # 200
curl -I https://ahmad-vanessa.com/home/            # 301 → /
curl -I https://ahmad-vanessa.com/impressum/       # 200
curl -X GET https://ahmad-vanessa.com/api/contact  # 405 (only POST is allowed)
```
- Send a real message through https://ahmad-vanessa.com/kontakt/. It should arrive in your inbox, and pressing *Reply* should answer the sender directly (Reply-To).
- Check the Worker's logs: Worker → **Observability** / **Logs**. A failed send shows up as `send_email failed`.
- Once everything works: keep a backup of the WordPress site (All-in-One WP Migration export), then cancel Hostinger.

---

## Local development
| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server at http://localhost:4321. Fast editing, but the form API isn't available. |
| `npm run preview:cf` | Builds and runs the real Worker at http://localhost:8787, including the form. |

In `preview:cf`, Turnstile uses Cloudflare's test keys (the secret is in `.dev.vars`, which is not committed) and always passes. Emails are **not** sent: Wrangler writes them as `.eml` files under `.wrangler/tmp/email/` and prints the path in the terminal.

---

## Where to change things
| What | File |
|---|---|
| Text, links, order button | `src/data/site.ts` |
| Reading dates (archive) | `src/data/events.ts` |
| Reader quotes | `src/data/testimonials.ts` |
| Instagram posts (click-to-load) | `src/data/instagram.ts` |
| Press links | `src/data/media.ts` |
| Impressum / Datenschutz details | `src/data/legal.ts` (texts: `src/pages/impressum.astro`, `src/pages/datenschutz.astro`) |
| Form logic / email format | `worker/contact.ts` |

> The Impressum and Datenschutzerklärung are carefully written templates based on what this site actually does. They are **not legal advice**. If anything changes (e.g. you add analytics or a newsletter), update the privacy policy. You can check it against a generator such as e-recht24.de, or with a lawyer.
