# indulohithnarisetty.com

Source for **Indu Lohith Narisetty**'s personal portfolio — a cybersecurity-themed, terminal-first profile for Senior SecOps / Detection Engineering / SOC / AppSec roles.

> `$ whoami --one-line`
> Security Operations Engineer — I build high-fidelity SIEM detections, lead IR, and automate SOC workflows across Splunk, Sentinel, CrowdStrike, and AWS.

## What this repo contains

| Path                         | Purpose                                                                    |
| ---------------------------- | -------------------------------------------------------------------------- |
| `src/app/`                   | Next.js 14 App Router pages                                                |
| `src/components/`            | React components — Terminal, AttackMatrix, TriageSimulator, etc.           |
| `content/`                   | **Everything editable lives here.** Data files + MDX case studies          |
| `content/projects/*.mdx`     | Long-form project case studies (one file = one project)                    |
| `workers/visitor-counter/`   | Cloudflare Worker + KV counter (deployed separately)                       |
| `public/`                    | Favicon, OG image, drop `resume.pdf` here                                  |
| `MAINTAIN.md`                | The entire maintenance story. Edit one file, `git push`.                   |
| `CONTENT.md`                 | Map of "I want to change X → edit file Y"                                  |
| `DEPLOY.md`                  | Copy-pasteable commands for first deploy (domain → CF Pages → Worker → Cal)|

## Features

- **Terminal-first landing** with interactive command mode (`whoami`, `skills`, `experience`, `projects`, `attack`, `triage`, `book`, `hire-me`, `help`, tab-complete, history).
- **Visual Mode** (default ON for first-time visitors) — polished card-driven UI over the same data.
- **Live MITRE ATT&CK coverage heatmap** — click any cell for the Splunk SPL / Sentinel KQL / Sigma behind it.
- **Triage This Alert** — 5-step interactive investigation of phishing → credential theft → lateral movement with MITRE mapping, live queries, decision scoring, and the full post-incident report.
- **Project case studies** — JSecPy, SOAR Enrichment Pipeline, MITRE ATT&CK Detection Coverage Map, AWS Cloud Detection Baseline, Sigma Detection Library, Phishing Triage Playbook, Purple-Team Exercise, Service-Account Baseline Monitor.
- **Cert badges** with verified links.
- **Google Meet booking** via Cal.com embed (free, no API keys).
- **Privacy-respecting visitor counter** — Cloudflare Worker + KV, no cookies, no Google Analytics, no third-party trackers.
- **WCAG 2.1 AA**, keyboard-first, `prefers-reduced-motion` fallback, Lighthouse-tuned.
- **Static export** — free hosting on Cloudflare Pages, auto-deploy from GitHub.

## Tech stack

- Next.js 14 (App Router, `output: 'export'`)
- TypeScript strict
- Tailwind CSS + custom CRT / matrix-rain aesthetic
- Framer Motion (used sparingly, reduced-motion aware)
- MDX via `next-mdx-remote/rsc`
- Cloudflare Pages (static host) + Cloudflare Worker (counter API) + Cloudflare Registrar (domain)
- Cal.com (booking embed, Google Calendar integration)
- GitHub (source + CI/CD auto-deploy on push)

## Quick start (local dev)

```bash
npm install
cp .env.example .env.local      # edit the Cal username + counter URL if yours differ
npm run dev                     # http://localhost:3000
```

## First-time deploy

Follow `DEPLOY.md` top-to-bottom. It covers: buy domain, create GitHub repo, connect Cloudflare Pages, deploy the visitor-counter Worker, hook up Cal.com, and enable Cloudflare Web Analytics.

## Maintenance

Everything you will want to update after launch — a new project, a new cert, a new job, a new detection — is a single file edit under `content/`. See `MAINTAIN.md`.

## License

Personal portfolio. Code is MIT; content (bullet points, project descriptions, queries) is reserved © Indu Lohith Narisetty.
