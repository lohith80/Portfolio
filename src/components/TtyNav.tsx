'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { profile } from '@content/profile';

/**
 * TtyNav — terminal-style top strip. Replaces VisualNav.
 * Renders a single line of tmux-tab-like entries. No mobile drawer — the list
 * wraps or horizontal-scrolls; on narrow screens it collapses to two rows.
 */

const ITEMS: { href: string; key: string; label: string }[] = [
  { href: '/',              key: '0', label: 'whoami' },
  { href: '/detections',    key: '1', label: 'detections' },
  { href: '/projects',      key: '2', label: 'projects' },
  { href: '/attack-matrix', key: '3', label: 'attack' },
  { href: '/triage',        key: '4', label: 'triage' },
  { href: '/experience',    key: '5', label: 'experience' },
  { href: '/skills',        key: '6', label: 'skills' },
  { href: '/book',          key: '7', label: 'book' },
];

export function TtyNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcuts: 1..7 and g-prefix nav
  useEffect(() => {
    let pendingG = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'g' && !pendingG) {
        pendingG = true;
        gTimer = setTimeout(() => { pendingG = false; }, 900);
        return;
      }

      // Number jumps: 0..7
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n)) {
        const item = ITEMS.find((i) => i.key === e.key);
        if (item) {
          e.preventDefault();
          window.location.href = item.href;
          return;
        }
      }

      if (pendingG) {
        // g + letter shortcuts
        pendingG = false;
        if (gTimer) clearTimeout(gTimer);
        const map: Record<string, string> = {
          h: '/',           // g h → home
          w: '/',           // g w → whoami
          d: '/detections', // g d
          p: '/projects',   // g p
          a: '/attack-matrix', // g a
          t: '/triage',     // g t
          e: '/experience', // g e
          s: '/skills',     // g s
          b: '/book',       // g b
          c: '/book',       // g c → call
        };
        const href = map[e.key.toLowerCase()];
        if (href) {
          e.preventDefault();
          window.location.href = href;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      if (gTimer) clearTimeout(gTimer);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-phos/25 transition-colors',
        scrolled ? 'bg-[var(--bg-crt)]/95 backdrop-blur-sm' : 'bg-[var(--bg-crt)]/80',
      )}
    >
      <div className="wrap-wide flex items-center gap-3 overflow-x-auto px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] no-scrollbar sm:py-2 sm:text-[12px]">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-1 text-phos no-underline"
          aria-label={`${profile.handle}@${profile.host} — home`}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-phos shadow-[0_0_8px_rgba(94,242,255,0.8)] group-hover:bg-white" aria-hidden />
          <span className="tracking-[0.22em] text-magenta">{profile.handle}</span>
          <span className="text-slate-500">@</span>
          <span className="tracking-[0.22em] text-phos">{profile.host}</span>
        </Link>

        <span className="hidden text-slate-600 sm:inline">|</span>

        <nav aria-label="Primary" className="flex shrink-0 items-center gap-0.5">
          {ITEMS.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group inline-flex items-center gap-1 px-1.5 py-0.5 no-underline transition',
                  active ? 'text-phos' : 'text-slate-400 hover:text-phos',
                )}
                title={`press ${item.key} or g-${item.label[0]}`}
              >
                <span className={cn('text-[10px]', active ? 'text-magenta' : 'text-slate-600')}>
                  {item.key}:
                </span>
                <span>
                  {active && <span aria-hidden className="mr-0.5 text-magenta">*</span>}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <span className="ml-auto hidden shrink-0 items-center gap-2 text-slate-500 md:flex">
          <span>press</span>
          <span className="kbd">g</span>
          <span className="kbd">p</span>
          <span>→ projects</span>
        </span>
      </div>
    </header>
  );
}
