# DEPLOY.md — ship it

Copy-pasteable commands for launching `indulohithnarisetty.com`. Follow the sections in order.

Total time, first time: **~45 minutes**. After that, every push is automatic.

---

## 0 — Prerequisites

- [Node.js 18.17+](https://nodejs.org/) installed
- A GitHub account
- A credit card for the domain registration (~$10/year via Cloudflare Registrar — at-cost, no markup)
- A Google account (`indulohithnarisetty@gmail.com`) for Calendar + Meet
- Git configured locally

```bash
node -v   # v18.17+ or newer
git --version
```

---

## 1 — Local dev check

```bash
cd E:\Portfolio
npm install
npm run typecheck
npm run dev        # open http://localhost:3000
```

Confirm the landing page loads, the terminal accepts `help`, `whoami`, `skills`, `projects`, `attack`, `triage`. Hit `/triage` and click through the simulation. Hit `/attack-matrix` and open a cell. Hit `/book` (will show a Cal.com placeholder until you finish section 6).

Drop your resume at `public/resume.pdf` before shipping (see `public/resume.README.md`).

---

## 2 — Push to GitHub

```bash
git init
git add .
git commit -m "initial: portfolio scaffold"
git branch -M main
```

Create the remote repo on GitHub (recommend **public** — a SecOps candidate benefits from a clean public repo as a code sample):

```bash
# Using GitHub CLI:
gh auth login
gh repo create indulohithnarisetty/portfolio --public --source=. --remote=origin --push
```

Or manually: create the repo on github.com, then:

```bash
git remote add origin https://github.com/<your-user>/portfolio.git
git push -u origin main
```

---

## 3 — Buy `indulohithnarisetty.com`

### Option A — Cloudflare Registrar (recommended; at-cost)

1. Sign in / sign up at **https://dash.cloudflare.com/**
2. Left sidebar → **Registrar** → **Register Domains**
3. Search for `indulohithnarisetty.com` → add to cart → checkout
4. Cloudflare automatically sets itself as the DNS provider. No extra step.

### Option B — if `indulohithnarisetty.com` is taken

Alternatives to register (all strong, spellable, professional):

- `indulohith.com`
- `indulohith.dev` *(Google `.dev`, HTTPS-required, excellent for SecOps/tech)*
- `lohithnarisetty.com`
- `indunarisetty.com`

Buy any of these at Cloudflare Registrar the same way.

### Backup registrar — Namecheap (if CF Registrar rejects)

```bash
# Namecheap flow (manual):
# 1) Register at https://www.namecheap.com/domains/registration/results/?domain=indulohithnarisetty
# 2) After purchase, in Namecheap → Domain List → Manage → Nameservers → Custom DNS
# 3) Set nameservers to the two CF nameservers you'll see in step 4 below.
```

---

## 4 — Connect Cloudflare Pages to GitHub

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Authorize GitHub, pick `<your-user>/portfolio`
3. **Build configuration**:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/` (leave as-is)
   - Environment variables (click *Add variable*):
     - `NEXT_PUBLIC_SITE_URL` = `https://indulohithnarisetty.com`
     - `NEXT_PUBLIC_CAL_USERNAME` = `indulohithnarisetty` (will be set after §6)
     - `NEXT_PUBLIC_COUNTER_URL` = (set after §5)
4. Save → first deploy runs. In ~45 seconds you get a URL like `https://portfolio-x9z.pages.dev`. Open it. Confirm it loads.

### 4a — Attach the custom domain

1. In Pages → your project → **Custom domains** → **Set up a custom domain**
2. Enter `indulohithnarisetty.com` → Continue → Cloudflare auto-configures DNS.
3. Also add `www.indulohithnarisetty.com` as a second custom domain if you want it to resolve (it'll redirect).
4. SSL is provisioned automatically (~1 minute).

---

## 5 — Deploy the visitor-counter Worker

```bash
cd workers/visitor-counter
npm install

# Login once:
npx wrangler login

# Create the KV namespace — copy the returned "id" into wrangler.toml
npx wrangler kv namespace create VISITOR_COUNTER
# paste the id into [[kv_namespaces]].id in wrangler.toml

# Seed the counter to 0 (optional):
npx wrangler kv key put --binding=COUNTER total 0

# Ship it:
npx wrangler deploy
```

The output prints something like:

```
Deployed visitor-counter (1.23 sec)
  https://visitor-counter.<your-subdomain>.workers.dev
```

Copy that URL. In Cloudflare Pages → your project → **Settings → Environment variables → Production**, set:

```
NEXT_PUBLIC_COUNTER_URL = https://visitor-counter.<your-subdomain>.workers.dev
```

Trigger a redeploy of Pages (**Deployments → Retry deployment** on the latest).

Test it:

```bash
curl https://visitor-counter.<your-subdomain>.workers.dev/count
# → {"count":0}
curl https://visitor-counter.<your-subdomain>.workers.dev/hit
# → {"count":1}
```

### Optional — pretty subdomain

Uncomment the `[[routes]]` block in `workers/visitor-counter/wrangler.toml` to map `visitors.indulohithnarisetty.com` to the worker. Redeploy:

```bash
npx wrangler deploy
```

Then update `NEXT_PUBLIC_COUNTER_URL` in Pages to `https://visitors.indulohithnarisetty.com`.

---

## 6 — Connect Cal.com + Google Calendar + Google Meet

1. Sign up at **https://cal.com/signup** with `indulohithnarisetty@gmail.com`.
2. Pick the username **`indulohithnarisetty`** (or any — put the username into `NEXT_PUBLIC_CAL_USERNAME` in Pages env vars).
3. During onboarding (or later: **Settings → Apps → Installed Apps**):
   - **Google Calendar** — *Install → Authenticate* (grants calendar read/write)
   - **Google Meet** — *Install* (one click; uses the same Google token)
4. **Event types**:
   - Create **15min** → Length: 15 min → Location: *Google Meet (conferencing)* → Save.
   - Create **30min** → Length: 30 min → Location: *Google Meet* → Save.
5. Set availability under **Availability** (default working hours are fine).
6. Verify booking URL works: visit `https://cal.com/indulohithnarisetty/15min`. Book a test slot — you should receive a Google Calendar event with a Meet link auto-populated.
7. Confirm `NEXT_PUBLIC_CAL_USERNAME` in Cloudflare Pages matches your Cal.com username. Redeploy Pages.

That's the whole booking system. No API keys to manage on your side.

---

## 7 — Enable Cloudflare Web Analytics (your eyes only)

1. Cloudflare dashboard → **Analytics & Logs → Web Analytics**
2. **Add a site** → enter `indulohithnarisetty.com`
3. Choose **Automatic setup** since your domain is on Cloudflare. No JS snippet to add.
4. Data starts flowing in ~10 minutes. It is privacy-first (no cookies, no PII, no Google). Visitors never see it.

---

## 8 — Accessibility + Lighthouse audit

Run both locally before declaring done.

```bash
# Build the static export
npm run build
npx serve out            # http://localhost:3000 — serve the static output

# In another terminal, run Lighthouse headless:
npx lighthouse http://localhost:3000 \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-desktop.html \
  --chrome-flags="--headless --no-sandbox"

npx lighthouse http://localhost:3000 \
  --preset=perf \
  --form-factor=mobile \
  --output=html \
  --output-path=./lighthouse-mobile.html \
  --chrome-flags="--headless --no-sandbox"
```

Target: **95+ Performance / 100 Accessibility / 100 Best Practices / 100 SEO on mobile.**

Manual a11y spot-check (5 minutes):

1. Tab through the landing page. Every interactive element should get a visible focus ring.
2. Hit the site with VoiceOver (macOS) or NVDA (Windows). The landing hero should announce pitch + CTAs.
3. DevTools → Rendering → *Emulate CSS media feature prefers-reduced-motion: reduce* → matrix rain and scanlines should disappear; site remains fully usable.
4. DevTools → Rendering → *Emulate vision deficiencies* → confirm contrast passes for each.

Run [axe DevTools](https://www.deque.com/axe/devtools/) on each page. Expect **0 critical** issues; any found will be one of: missing aria-label on a decorative icon, a skipped heading level in MDX content, or a color-contrast warning on a chip. All fixable inline.

---

## 9 — Post-launch checklist

- [ ] `indulohithnarisetty.com` resolves and loads.
- [ ] `www.indulohithnarisetty.com` redirects to apex.
- [ ] Footer visitor counter shows a number.
- [ ] `/resume.pdf` downloads your resume.
- [ ] `/book` shows Cal.com 30min event with Google Meet.
- [ ] LinkedIn preview works — paste the URL into a LinkedIn post composer; the OG card should show your name, title, and the CRT-themed image.
- [ ] Lighthouse mobile ≥ 95 / 100 / 100 / 100.
- [ ] Cloudflare Web Analytics is receiving hits.
- [ ] GitHub repo is public with a clean README.

---

## 10 — Everyday updates after launch

One file. One `git push`. That's it. See `MAINTAIN.md`.
