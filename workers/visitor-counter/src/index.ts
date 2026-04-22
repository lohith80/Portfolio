/**
 * visitor-counter — privacy-respecting hit counter for indulohithnarisetty.com
 *
 * Storage: Cloudflare Workers KV (namespace bound as COUNTER).
 * Semantics: GET /hit  -> increment once, return {count}
 *            GET /count -> read without increment
 *
 * No IP storage, no cookies, no PII. A single integer key. That's it.
 */

export interface Env {
  COUNTER: KVNamespace;
  /** Comma-separated list of allowed origins (e.g., "https://indulohithnarisetty.com,https://<hash>.pages.dev"). */
  ALLOWED_ORIGINS: string;
}

const KEY = 'total';

function corsHeaders(origin: string, allowed: string[]): HeadersInit {
  const permitted = allowed.includes('*') || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': permitted ? origin : allowed[0] ?? '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

async function getCount(env: Env): Promise<number> {
  const raw = await env.COUNTER.get(KEY);
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

async function setCount(env: Env, n: number): Promise<void> {
  await env.COUNTER.put(KEY, String(n));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';
    const allowed = (env.ALLOWED_ORIGINS ?? '*').split(',').map((s) => s.trim()).filter(Boolean);
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (path === '/hit') {
        const current = await getCount(env);
        const next = current + 1;
        await setCount(env, next);
        return json({ count: next }, cors);
      }
      if (path === '/count' || path === '/') {
        const current = await getCount(env);
        return json({ count: current }, cors);
      }
      return json({ error: 'not found' }, cors, 404);
    } catch (e) {
      return json({ error: 'internal', detail: String(e) }, cors, 500);
    }
  },
};

function json(body: unknown, cors: HeadersInit, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...cors,
    },
  });
}
