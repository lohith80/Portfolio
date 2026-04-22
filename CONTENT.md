# CONTENT.md — where to edit what

All user-editable content lives under `/content`. Nothing else needs to be touched to refresh the site.

## Quick map

| I want to change…                                           | Edit this file                                            |
| ----------------------------------------------------------- | --------------------------------------------------------- |
| Name, pitch, tagline, email, phone, LinkedIn, availability  | `content/profile.ts`                                      |
| Skills — add/remove/re-rank any skill                       | `content/skills.ts`                                       |
| Certifications (active or pursuing)                         | `content/certs.ts`                                        |
| Work experience (company, role, bullets, stack)             | `content/experience.ts`                                   |
| Project list + metadata (for card & list page)              | `content/projects.ts`                                     |
| A project's long-form case study                            | `content/projects/<slug>.mdx`                             |
| MITRE ATT&CK coverage cells (techniques + queries + notes)  | `content/attack-techniques.ts`                            |
| Triage-This-Alert scenario steps / queries / choices / report | `content/triage-scenario.ts`                              |
| Resume PDF                                                  | `public/resume.pdf` (drop it here)                        |
| Favicon                                                     | `public/favicon.svg`                                      |
| OG preview image (LinkedIn / Twitter cards)                 | `public/og.svg` or replace with `og.png` and update layout |

## How the pieces compose

```
content/
├── profile.ts                    ← name, pitch, socials, availability
├── skills.ts                     ← grouped skills w/ depth level
├── certs.ts                      ← cert badges + verified links
├── experience.ts                 ← roles + bullets + stack
├── projects.ts                   ← project LIST (cards, list page, search)
├── projects/
│   ├── jsecpy.mdx                ← one MDX file per project slug
│   ├── soar-enrichment-pipeline.mdx
│   ├── mitre-coverage-map.mdx
│   ├── aws-cloud-detection-baseline.mdx
│   ├── sigma-detection-library.mdx
│   ├── phishing-triage-playbook.mdx
│   ├── purple-team-coverage-exercise.mdx
│   └── service-account-baseline.mdx
├── attack-techniques.ts          ← MITRE ATT&CK coverage matrix
└── triage-scenario.ts            ← Triage This Alert simulator
```

## Rules of thumb

1. **Add a project** → add a row to `projects.ts` AND create `content/projects/<slug>.mdx`. The slug must match.
2. **Add a cert** → add a row to `certs.ts`. That's it.
3. **Add a new job** → add a role object to `experience.ts`.
4. **Add a new MITRE technique** → add a row to `attack-techniques.ts`. Set the `coverage` to `detect | hunt | investigate | aware` and supply tooling + optional query snippet.
5. **Change the pitch** → `profile.ts` → `pitch` / `shortPitch`.
6. **Update availability banner** → `profile.ts` → `availability`.

## Running after an edit

```bash
npm run dev        # visual check locally
git add content/ public/resume.pdf
git commit -m "content: add AWS baseline project"
git push           # Cloudflare Pages auto-deploys in ~45 seconds
```

That's it. No CMS login. No database migration. No image upload pipeline. One file, one push.
