# MAINTAIN.md — how to keep the site current

## The entire maintenance story

> **Edit one file. `git push`. Done.**

No CMS, no admin panel, no database, no image pipeline, no re-deploy button to click.

Cloudflare Pages watches the `main` branch on GitHub. Every push kicks off a build (~45 seconds) and the new site is live.

---

## Recipes

### 1 — Add a new project

```bash
# 1) Register the project in the list (drives /projects and the card grid)
$EDITOR content/projects.ts

# 2) Write the case study
$EDITOR content/projects/<slug>.mdx

# 3) Ship
git add content/projects.ts content/projects/<slug>.mdx
git commit -m "projects: add <slug>"
git push
```

Minimum `projects.ts` row:

```ts
{
  slug: 'my-new-project',
  title: 'My New Project',
  tagline: 'One-liner that lands the value',
  role: 'solo',
  status: 'shipped',
  accent: 'phos',
  domain: ['detection'],
  metrics: [
    { label: 'Impact', value: '40% ↓' },
    { label: 'Stack', value: 'Python' },
    { label: 'Status', value: 'live' },
  ],
  stack: ['Python', 'Sentinel', 'ATT&CK'],
  summary: 'Two sentences. Problem. Outcome.',
}
```

### 2 — Add a new certification

```bash
$EDITOR content/certs.ts
```

```ts
{
  id: 'gcih',
  abbr: 'GCIH',
  name: 'GIAC Certified Incident Handler',
  issuer: 'SANS / GIAC',
  status: 'active',
  color: 'magenta',
  verifyUrl: 'https://www.credly.com/badges/...',
}
```

```bash
git add content/certs.ts && git commit -m "certs: add GCIH" && git push
```

### 3 — Add a new role (job change / promotion)

```bash
$EDITOR content/experience.ts
```

Add a new `Role` object at the top of `roles`. `start: 'Jan 2027', end: 'Present'`, fill in bullets.

```bash
git add content/experience.ts && git commit -m "experience: new role" && git push
```

### 4 — Ship a new ATT&CK coverage cell

```bash
$EDITOR content/attack-techniques.ts
```

Append:

```ts
{
  id: 'T1556',
  name: 'Modify Authentication Process',
  tactic: 'credential-access',
  coverage: 'detect',
  tooling: ['Sentinel KQL', 'Defender for Identity'],
  note: 'Alerts on Kerberoastable accounts being created or SPN changes.',
  query: { lang: 'KQL', snippet: '...' },
}
```

### 5 — Update the Triage This Alert simulator

Edit `content/triage-scenario.ts` — steps, alert cards, KQL/SPL snippets, choices, debriefs, and the post-incident report are all in this single file.

### 6 — Replace resume

Drop the new PDF at `public/resume.pdf` (filename exact). `git add public/resume.pdf && git commit && git push`.

### 7 — Update the pitch / availability banner

```bash
$EDITOR content/profile.ts    # edit `pitch`, `availability`, `tagline`, etc.
git commit -am "profile: update pitch" && git push
```

---

## If the site breaks after a push

- Cloudflare Pages will show the build error in **Deployments → latest → View Log**.
- 90% of failures are a missing comma in a `.ts` file or a typo in MDX frontmatter.
- Run locally first: `npm run dev` and `npm run typecheck`.
- To roll back: in Cloudflare Pages → **Deployments** → pick a previous deployment → **Rollback to this deployment**.

## Things that are **not** maintenance

- You do not run migrations.
- You do not rotate API keys (there are none on your side — Cal.com owns its keys).
- You do not manage a database.
- You do not pay any monthly fees (Cloudflare Pages + Workers free tier covers the entire traffic profile of a portfolio site, and Cal.com has a free tier with Google Meet).

## A good weekly / monthly ritual

- **Weekly (60 seconds)**: open the site, skim any outdated bullet.
- **Monthly (10 minutes)**: update `projects.ts` metrics if a metric moved (MTTR, FP rate, coverage count).
- **After each new certification or role**: follow recipes 2 or 3 above.

That's the whole maintenance loop.
