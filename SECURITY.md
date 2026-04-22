# Security

This is a static personal portfolio. It does not collect user input, store PII, or run server-side code beyond a single integer counter.

## Reporting a vulnerability

If you notice a security issue in this site (CSP bypass, XSS via MDX rendering, open redirect on the terminal `open` command, or a leaked secret) email **indulohithnarisetty@gmail.com** with:

- A short description
- Reproduction steps
- What you would expect instead

I will acknowledge within 72 hours.

## Scope

In-scope:
- The web app served from `indulohithnarisetty.com`.
- The visitor-counter Worker at `visitor-counter.<subdomain>.workers.dev` (or `visitors.indulohithnarisetty.com`).

Out-of-scope:
- Cal.com infrastructure — report to Cal.com.
- Cloudflare infrastructure — report to Cloudflare.
- Google Calendar / Meet — report to Google.

## What this site does not do

- No tracking cookies
- No Google Analytics
- No third-party ad / analytics loaders
- No form submissions
- No user data persisted beyond a monotonic integer
- No IP logging
