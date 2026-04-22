'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { profile } from '@content/profile';

/**
 * StatusBar — persistent tmux/i3-style bottom strip.
 * Shows: user@host:pwd | visitor count | UTC time | keyboard hints.
 * Replaces the old <Footer />. Always mounted.
 */
export function StatusBar() {
  const pathname = usePathname();
  const [now, setNow] = useState('');
  const [count, setCount] = useState<string>('—');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      const ss = String(d.getUTCSeconds()).padStart(2, '0');
      setNow(`${hh}:${mm}:${ss}Z`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_COUNTER_URL;
    if (!url) return;
    const key = 'tty.visit.counted';
    const hit = async () => {
      try {
        if (sessionStorage.getItem(key) === '1') {
          const r = await fetch(`${url}/count`, { cache: 'no-store' });
          const j = await r.json();
          setCount(String(j.count ?? '—'));
        } else {
          const r = await fetch(`${url}/hit`, { cache: 'no-store' });
          const j = await r.json();
          setCount(String(j.count ?? '—'));
          sessionStorage.setItem(key, '1');
        }
      } catch { /* offline / local */ }
    };
    hit();
  }, []);

  const pwd = pathname === '/' ? '~' : `~${pathname}`;

  return (
    <div
      aria-label="Status bar"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-phos/25 bg-[var(--bg-crt)]/95 backdrop-blur-sm"
    >
      <div className="wrap-wide flex h-7 items-center gap-3 overflow-x-auto font-mono text-[11px] uppercase tracking-[0.14em] no-scrollbar">
        <span className="flex shrink-0 items-center gap-1 text-phos">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-phos shadow-[0_0_6px_rgba(94,242,255,0.8)]" aria-hidden />
          <span className="text-phos/90">{profile.handle}@{profile.host}</span>
          <span className="text-slate-500">:</span>
          <span className="text-slate-300">{pwd}</span>
          <span className="text-magenta">$</span>
        </span>

        <span className="hidden items-center gap-1 text-slate-500 sm:flex">
          <span className="text-phos/60">[?]</span>
          <span>shortcuts</span>
          <span className="text-slate-700">·</span>
          <span className="text-phos/60">[/]</span>
          <span>search</span>
        </span>

        <span className="ml-auto flex shrink-0 items-center gap-3 text-slate-500">
          <span className="hidden sm:inline">
            <span className="text-phos/70">visitors</span>{' '}
            <span className="text-phos tnum">{count}</span>
          </span>
          <span className="text-slate-700">·</span>
          <span className="tnum text-slate-300">{now}</span>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <Link
            href="/book"
            className="hidden text-magenta hover:text-white sm:inline"
          >
            [book]
          </Link>
          <Link
            href="/resume.pdf"
            prefetch={false}
            className="text-phos hover:text-white"
          >
            [cv]
          </Link>
        </span>
      </div>
    </div>
  );
}
