'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const CAL_USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME ?? 'indulohithnarisetty';

type CalFn = ((...args: unknown[]) => void) & {
  ns?: Record<string, unknown>;
  q?: unknown[];
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

export function CalEmbed({ slug = '15min' }: { slug?: '15min' | '30min' }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tryInit = () => {
      if (!window.Cal) return false;
      window.Cal('init', 'secops-meet', { origin: 'https://app.cal.com' });
      if (window.Cal) window.Cal.ns = window.Cal.ns ?? {};
      window.Cal('inline', {
        elementOrSelector: '#cal-inline',
        calLink: `${CAL_USERNAME}/${slug}`,
        layout: 'month_view',
        config: { theme: 'dark' },
      });
      window.Cal('ui', {
        theme: 'dark',
        styles: { branding: { brandColor: '#5ef2ff' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
      return true;
    };
    if (tryInit()) return;
    const id = setInterval(() => {
      if (tryInit()) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [slug]);

  return (
    <>
      <Script id="cal-embed" strategy="afterInteractive">
        {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");`}
      </Script>
      <div
        id="cal-inline"
        className="min-h-[640px] w-full rounded-sm border border-phos/30 bg-ink-900/60"
        aria-label="Book a 15 or 30 minute call"
      />
    </>
  );
}
