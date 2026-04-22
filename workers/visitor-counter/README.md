# visitor-counter

A 60-line Cloudflare Worker that stores a single integer in KV: `total`. No IPs, no cookies, no PII, no tables, no schema migrations.

## Endpoints

| Method | Path      | Effect                                  | Response           |
| ------ | --------- | --------------------------------------- | ------------------ |
| GET    | `/hit`    | Increment + return new count            | `{ "count": 42 }`  |
| GET    | `/count`  | Read the current count (no increment)   | `{ "count": 42 }`  |

The front-end calls `/hit` once per browser session (via `sessionStorage`) and `/count` on subsequent page loads within the session. That keeps the number honest without tracking the visitor.

## First-time deploy

```bash
cd workers/visitor-counter
npm install

# 1) Log in to Cloudflare (opens browser once).
npx wrangler login

# 2) Create the KV namespace and copy the returned id into wrangler.toml.
npx wrangler kv namespace create VISITOR_COUNTER
# ↓ paste id into [[kv_namespaces]].id in wrangler.toml

# 3) Seed the counter to 0 (optional — /hit on a missing key starts at 1 anyway).
npx wrangler kv key put --binding=COUNTER total 0

# 4) Deploy.
npx wrangler deploy
```

The deploy prints a URL like `https://visitor-counter.<your-subdomain>.workers.dev`. Put that URL in the root project's `.env`:

```
NEXT_PUBLIC_COUNTER_URL=https://visitor-counter.<your-subdomain>.workers.dev
```

## Optional: custom subdomain

Uncomment the `[[routes]]` block in `wrangler.toml` to serve the worker at `visitors.indulohithnarisetty.com/*` once Cloudflare is the authoritative DNS for your domain. Run `wrangler deploy` again.

## Security

- **Origin allowlist**: set `ALLOWED_ORIGINS` in `wrangler.toml` to a comma-separated list (`https://indulohithnarisetty.com,https://*.pages.dev`). Unknown origins get the first allowed origin as a fallback, which simply fails CORS in the browser.
- **Method allowlist**: only `GET` and `OPTIONS` are accepted.
- **No logging of IPs** — the worker never reads `CF-Connecting-IP`.

## Cost

Free tier:
- 100,000 Worker invocations / day
- 1,000 KV writes / day
- 100,000 KV reads / day

At the volumes a personal portfolio sees, this will never cost money.
