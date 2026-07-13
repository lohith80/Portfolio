'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@content/profile';

/**
 * BootSequence — records-room retrieval slip shown on first visit.
 * The dossier is located, its exhibits attached, the redaction pass run,
 * and the release stamp comes down before the file opens.
 * - localStorage: `tty.booted=1` suppresses subsequent loads until cleared.
 * - `?boot=1` query forces a replay.
 * - Any keypress / click skips immediately.
 * - `prefers-reduced-motion` → no typing animation; renders final state + auto-dismiss 600ms.
 */

type BootLine =
  | { kind: 'ok'; label: string; detail?: string }
  | { kind: 'warn'; label: string; detail?: string }
  | { kind: 'info'; text: string }
  | { kind: 'blank' }
  | { kind: 'banner'; text: string }
  | { kind: 'stamp'; text: string }
  | { kind: 'raw'; text: string };

const SCRIPT: BootLine[] = [
  { kind: 'info', text: 'RECORDS DIVISION — dossier retrieval terminal rev 6.02' },
  { kind: 'info', text: 'request ........................................ RD-0706 (public reading room)' },
  { kind: 'blank' },
  { kind: 'ok',   label: 'locate dossier: NARISETTY, INDU LOHITH', detail: '[cabinet 04 · drawer B · folder 07]' },
  { kind: 'ok',   label: 'verify chain of custody',                detail: 'unbroken · 9 transfers' },
  { kind: 'ok',   label: 'attach exhibit: detections',             detail: 'production SPL · KQL · Sigma' },
  { kind: 'ok',   label: 'attach exhibit: attack coverage',        detail: '14 tactics · heatmap enclosed' },
  { kind: 'ok',   label: 'attach exhibit: projects',               detail: '8 case studies' },
  { kind: 'ok',   label: 'attach exhibit: service record',         detail: '4+ years · 3 postings' },
  { kind: 'ok',   label: 'attach exhibit: triage exercise',        detail: 'live-fire · 5 decision points' },
  { kind: 'ok',   label: 'redaction review',                       detail: '0 sections withheld' },
  { kind: 'warn', label: 'coffee ring on page 3',                  detail: 'noted · ignored' },
  { kind: 'blank' },
  { kind: 'info', text: 'routing: RECORDS → REVIEW → RELEASE ........... complete' },
  { kind: 'stamp', text: 'Approved for Public Release' },
  { kind: 'blank' },
  { kind: 'banner', text: profile.asciiBanner.trim() },
  { kind: 'blank' },
  { kind: 'info', text: 'dossier open — press any key to read' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function BootSequence({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'pending' | 'running' | 'done'>('pending');
  const [lines, setLines] = useState<BootLine[]>([]);
  const idxRef = useRef(0);

  useEffect(() => {
    // SSR-safe: only decide boot once mounted
    try {
      const url = new URL(window.location.href);
      const force = url.searchParams.get('boot') === '1';
      const already = !force && window.localStorage.getItem('tty.booted') === '1';
      if (already) {
        setPhase('done');
        return;
      }
      setPhase('running');
    } catch {
      setPhase('done');
    }
  }, []);

  useEffect(() => {
    if (phase !== 'running') return;

    // Reduced motion — render all lines instantly, dismiss quickly
    if (prefersReducedMotion()) {
      setLines(SCRIPT);
      const t = setTimeout(() => finish(), 600);
      return () => clearTimeout(t);
    }

    // Animated reveal
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const i = idxRef.current;
      if (i >= SCRIPT.length) {
        const t = setTimeout(() => finish(), 900);
        return () => clearTimeout(t);
      }
      setLines((prev) => [...prev, SCRIPT[i]]);
      idxRef.current = i + 1;
      const line = SCRIPT[i];
      const delay =
        line.kind === 'banner' ? 120 :
        line.kind === 'blank'  ? 40  :
        line.kind === 'stamp'  ? 520 :
        line.kind === 'warn'   ? 200 : 70;
      setTimeout(tick, delay + Math.random() * 40);
    };
    const startT = setTimeout(tick, 150);
    return () => {
      cancelled = true;
      clearTimeout(startT);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function finish() {
    try { window.localStorage.setItem('tty.booted', '1'); } catch {}
    setPhase('done');
  }

  useEffect(() => {
    if (phase !== 'running') return;
    const skip = () => finish();
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === 'done') return <>{children}</>;
  if (phase === 'pending') {
    // Avoid flashing content before deciding; render a bare dark shell
    return <div className="fixed inset-0 z-[60] bg-[var(--bg)]" aria-hidden />;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="System boot sequence"
      className="fixed inset-0 z-[60] overflow-y-auto bg-[var(--bg)] crt"
    >
      <div className="mx-auto max-w-[1100px] px-4 py-6 font-mono text-[12.5px] leading-[1.55] sm:px-8 sm:text-[13px]">
        <header className="mb-4 flex items-center justify-between border-b border-phos/20 pb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse bg-magenta" aria-hidden />
            records room — declassification in progress
          </span>
          <button
            type="button"
            onClick={finish}
            className="tty-link text-phos/80"
            aria-label="Skip boot sequence"
          >
            skip
          </button>
        </header>
        <pre className="whitespace-pre-wrap break-words text-slate-300">
          {lines.map((l, i) => renderLine(l, i))}
          {phase === 'running' && <span className="caret" aria-hidden />}
        </pre>
      </div>
    </div>
  );
}

function renderLine(l: BootLine, i: number) {
  const key = `l-${i}`;
  switch (l.kind) {
    case 'blank':
      return <div key={key}>&nbsp;</div>;
    case 'info':
      return (
        <div key={key} className="text-slate-400">
          <span className="text-phos/70">[INFO]  </span>
          {l.text}
        </div>
      );
    case 'ok':
      return (
        <div key={key}>
          <span className="text-phos">[  OK  ] </span>
          <span className="text-slate-200">{l.label}</span>
          {l.detail && <span className="text-slate-500">  {l.detail}</span>}
        </div>
      );
    case 'warn':
      return (
        <div key={key}>
          <span className="text-amber-300">[ WARN ] </span>
          <span className="text-slate-200">{l.label}</span>
          {l.detail && <span className="text-slate-500">  {l.detail}</span>}
        </div>
      );
    case 'banner':
      return (
        <div key={key} className="my-2">
          <span className="ascii block">{l.text}</span>
        </div>
      );
    case 'stamp':
      return (
        <div key={key} className="my-3 pl-2">
          <span className="stamp stamp-lg animate-stampIn">{l.text}</span>
        </div>
      );
    case 'raw':
      return <div key={key}>{l.text}</div>;
  }
}
