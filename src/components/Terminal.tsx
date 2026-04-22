'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { profile } from '@content/profile';
import { skillGroups } from '@content/skills';
import { certs } from '@content/certs';
import { roles } from '@content/experience';
import { projects } from '@content/projects';

type OutputLine = {
  id: string;
  kind: 'prompt' | 'stdout' | 'error' | 'success' | 'ascii';
  text: string;
};

const COMMANDS = [
  'whoami',
  'help',
  'skills',
  'experience',
  'projects',
  'certs',
  'attack',
  'triage',
  'book',
  'contact',
  'hire-me',
  'resume',
  'socials',
  'clear',
  'banner',
  'theme',
  'sudo',
  'exit',
] as const;

type Command = (typeof COMMANDS)[number];

const BANNER = `
   ██╗███╗   ██╗██████╗ ██╗   ██╗   ██╗      ███████╗███████╗ ██████╗
   ██║████╗  ██║██╔══██╗██║   ██║   ██║      ██╔════╝██╔════╝██╔════╝
   ██║██╔██╗ ██║██║  ██║██║   ██║   ██║█████╗███████╗█████╗  ██║
   ██║██║╚██╗██║██║  ██║██║   ██║   ██║╚════╝╚════██║██╔══╝  ██║
   ██║██║ ╚████║██████╔╝╚██████╔╝   ███████╗███████║███████╗╚██████╗
   ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝    ╚══════╝╚══════╝╚══════╝ ╚═════╝
          Indu Lohith Narisetty  ·  Senior Security Operations Engineer
`;

export function Terminal({
  initial = ['banner', 'whoami', 'help'],
  fullscreen = false,
  onExit,
  className,
}: {
  initial?: Command[] | string[];
  fullscreen?: boolean;
  onExit?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const didInitialise = useRef(false);

  const push = useCallback((line: Omit<OutputLine, 'id'>) => {
    setLines((prev) => [...prev, { ...line, id: `${Date.now()}-${prev.length}-${Math.random().toString(36).slice(2, 6)}` }]);
  }, []);

  const pushMany = useCallback((items: Omit<OutputLine, 'id'>[]) => {
    setLines((prev) => [
      ...prev,
      ...items.map((l, i) => ({
        ...l,
        id: `${Date.now()}-${prev.length + i}-${Math.random().toString(36).slice(2, 6)}`,
      })),
    ]);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmdLine = raw.trim();
      push({ kind: 'prompt', text: cmdLine });
      if (!cmdLine) return;

      const [cmd, ...args] = cmdLine.split(/\s+/);
      const c = cmd.toLowerCase();

      switch (c) {
        case 'banner': {
          push({ kind: 'ascii', text: BANNER });
          return;
        }
        case 'help': {
          pushMany([
            { kind: 'stdout', text: 'Commands:' },
            { kind: 'stdout', text: '  whoami        one-line pitch' },
            { kind: 'stdout', text: '  skills        detailed skill matrix (grouped)' },
            { kind: 'stdout', text: '  experience    roles, outcomes, stack' },
            { kind: 'stdout', text: '  projects      case studies (list)' },
            { kind: 'stdout', text: '  certs         certifications + verified links' },
            { kind: 'stdout', text: '  attack        open the interactive ATT&CK coverage matrix' },
            { kind: 'stdout', text: '  triage        open the Triage-This-Alert simulator' },
            { kind: 'stdout', text: '  book          schedule a 15 or 30 min call' },
            { kind: 'stdout', text: '  resume        download resume.pdf' },
            { kind: 'stdout', text: '  contact       email + LinkedIn' },
            { kind: 'stdout', text: '  socials       links to LinkedIn, GitHub' },
            { kind: 'stdout', text: '  hire-me       short pitch for why I fit a Senior SecOps role' },
            { kind: 'stdout', text: '  theme         toggle scanlines / matrix-rain effects' },
            { kind: 'stdout', text: '  clear         clear the terminal' },
            { kind: 'stdout', text: '  sudo <cmd>    nice try — useful easter egg inside' },
            { kind: 'stdout', text: '  exit          return to Visual Mode' },
            { kind: 'stdout', text: '' },
            { kind: 'stdout', text: 'Tip: ↑/↓ walks history. Tab completes. `open <url>` jumps to an external link.' },
          ]);
          return;
        }
        case 'whoami': {
          pushMany(profile.whoami.map(([key, value]) => ({ kind: 'stdout' as const, text: `${key.padEnd(12)} ${value}` })));
          push({ kind: 'success', text: `> ${profile.pitch}` });
          return;
        }
        case 'skills': {
          skillGroups.forEach((g) => {
            push({ kind: 'stdout', text: '' });
            push({ kind: 'success', text: `# ${g.label}` });
            g.skills.forEach((s) => {
              const bar = '█'.repeat({ expert: 4, strong: 3, working: 2, familiar: 1 }[s.level]) + '░'.repeat(4 - { expert: 4, strong: 3, working: 2, familiar: 1 }[s.level]);
              push({ kind: 'stdout', text: `  [${bar}]  ${s.name}${s.note ? `  — ${s.note}` : ''}` });
            });
          });
          return;
        }
        case 'experience': {
          roles.forEach((r) => {
            push({ kind: 'stdout', text: '' });
            push({ kind: 'success', text: `# ${r.company} — ${r.title}` });
            push({ kind: 'stdout', text: `  ${r.start} → ${r.end}   ${r.location}` });
            push({ kind: 'stdout', text: `  ${r.summary}` });
            r.bullets.forEach((b) => push({ kind: 'stdout', text: `  • ${b}` }));
            push({ kind: 'stdout', text: `  stack: ${r.stack.join(' · ')}` });
          });
          return;
        }
        case 'projects': {
          projects.forEach((p) => {
            push({ kind: 'stdout', text: '' });
            push({ kind: 'success', text: `# ${p.title}` });
            push({ kind: 'stdout', text: `  ${p.tagline}` });
            push({ kind: 'stdout', text: `  metrics: ${p.metrics.map((m) => `${m.label}=${m.value}`).join(' · ')}` });
            push({ kind: 'stdout', text: `  → /projects/${p.slug}` });
          });
          push({ kind: 'stdout', text: '' });
          push({ kind: 'stdout', text: 'Type `open projects` or click a slug above.' });
          return;
        }
        case 'certs': {
          certs.forEach((c) => {
            push({
              kind: 'stdout',
              text: `  ${c.status === 'active' ? '✓' : '…'} ${c.abbr.padEnd(12)} ${c.name}  (${c.issuer})${c.verifyUrl ? `  — ${c.verifyUrl}` : ''}`,
            });
          });
          return;
        }
        case 'contact': {
          pushMany([
            { kind: 'stdout', text: `email    : ${profile.email}` },
            { kind: 'stdout', text: `linkedin : ${profile.linkedin}` },
            { kind: 'stdout', text: `book     : /book` },
          ]);
          return;
        }
        case 'socials': {
          pushMany([
            { kind: 'stdout', text: `linkedin : ${profile.linkedin}` },
            { kind: 'stdout', text: `github   : ${profile.github}` },
          ]);
          return;
        }
        case 'hire-me': {
          pushMany([
            { kind: 'success', text: '> Why I fit a Senior SecOps role:' },
            { kind: 'stdout', text: '  - 4 years IR + detection engineering across SIEM (Splunk ES, Sentinel, QRadar), EDR (Falcon, Defender), cloud (AWS, Azure).' },
            { kind: 'stdout', text: '  - Authored 80+ detections mapped to ATT&CK, cut FPs 60% on top-10 noisiest rules.' },
            { kind: 'stdout', text: '  - Built Python SOAR that saved the SOC ~3 hrs/day of manual enrichment.' },
            { kind: 'stdout', text: '  - Led IR on ransomware-adjacent intrusions; drove purple-team exercises into shipped Sigma rules.' },
            { kind: 'stdout', text: '  - AppSec background — SAST/DAST, OWASP Top 10, pre-merge CI gates.' },
            { kind: 'stdout', text: '  - AWS SAA + Security+, CySA+, AZ-500. CISSP in progress.' },
            { kind: 'stdout', text: '' },
            { kind: 'success', text: '> /book — 15 or 30 minutes — Google Meet — same calendar as every senior role ahead of me.' },
          ]);
          return;
        }
        case 'attack': {
          push({ kind: 'success', text: 'opening /attack-matrix …' });
          router.push('/attack-matrix');
          return;
        }
        case 'triage': {
          push({ kind: 'success', text: 'opening /triage …' });
          router.push('/triage');
          return;
        }
        case 'book': {
          push({ kind: 'success', text: 'opening /book …' });
          router.push('/book');
          return;
        }
        case 'resume': {
          push({ kind: 'success', text: 'downloading resume.pdf …' });
          if (typeof window !== 'undefined') window.open('/resume.pdf', '_blank', 'noopener');
          return;
        }
        case 'open': {
          const target = args[0];
          if (!target) {
            push({ kind: 'error', text: 'usage: open <path-or-url>' });
            return;
          }
          push({ kind: 'success', text: `opening ${target} …` });
          if (/^https?:\/\//i.test(target) && typeof window !== 'undefined') {
            window.open(target, '_blank', 'noopener');
          } else {
            router.push(target.startsWith('/') ? target : `/${target}`);
          }
          return;
        }
        case 'theme': {
          if (typeof document !== 'undefined') {
            const html = document.documentElement;
            const dense = html.getAttribute('data-fx') === 'dense';
            html.setAttribute('data-fx', dense ? 'normal' : 'dense');
            push({ kind: 'success', text: dense ? 'effects: normal' : 'effects: dense (scanlines + rain emphasised)' });
          }
          return;
        }
        case 'clear': {
          setLines([]);
          return;
        }
        case 'exit': {
          push({ kind: 'success', text: 'returning to Visual Mode …' });
          onExit?.();
          return;
        }
        case 'sudo': {
          if (args.join(' ').toLowerCase() === 'hire me') {
            push({ kind: 'success', text: '[sudo] accepted. Routing to /book with priority boarding …' });
            setTimeout(() => router.push('/book'), 350);
          } else {
            push({ kind: 'error', text: `User ${profile.handle} is not in the sudoers file. This incident will be reported. (just kidding.)` });
          }
          return;
        }
        default: {
          push({ kind: 'error', text: `command not found: ${c}. type 'help'.` });
        }
      }
    },
    [push, pushMany, router, onExit],
  );

  useEffect(() => {
    if (didInitialise.current) return;
    didInitialise.current = true;
    (initial as string[]).forEach((c) => run(c));
    inputRef.current?.focus();
  }, [initial, run]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [lines]);

  const completions = useMemo(() => {
    const term = input.trim();
    if (!term) return [] as string[];
    const [first] = term.split(/\s+/);
    return COMMANDS.filter((c) => c.startsWith(first.toLowerCase()));
  }, [input]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input;
      setInput('');
      setHistIdx(-1);
      if (v.trim()) setHistory((h) => [...h, v]);
      run(v);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (completions.length === 1) setInput(completions[0] + ' ');
      else if (completions.length > 1) {
        push({ kind: 'prompt', text: input });
        pushMany(completions.map((c) => ({ kind: 'stdout' as const, text: `  ${c}` })));
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      if (history.length === 0) return;
      e.preventDefault();
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next] ?? '');
      return;
    }
    if (e.key === 'ArrowDown') {
      if (history.length === 0) return;
      e.preventDefault();
      const next = histIdx < 0 ? -1 : Math.min(history.length, histIdx + 1);
      setHistIdx(next >= history.length ? -1 : next);
      setInput(next >= history.length ? '' : history[next] ?? '');
      return;
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <section
      className={cn(
        'crt relative overflow-hidden rounded-sm border border-phos/30 bg-ink-950/80 text-[13.5px] leading-relaxed shadow-inset',
        fullscreen ? 'min-h-[calc(100dvh-3.5rem)]' : 'min-h-[560px]',
        className,
      )}
      aria-label="Interactive terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <header className="flex items-center justify-between border-b border-phos/20 bg-ink-900/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sev-crit" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-phos" aria-hidden />
          <span className="ml-3 font-display text-tiny uppercase tracking-[0.2em] text-slate-400">
            {profile.handle}@secops — zsh — 102x32
          </span>
        </div>
        <span className="font-mono text-tiny uppercase tracking-[0.2em] text-slate-500">
          ssh · utf-8 · tls ✓
        </span>
      </header>

      <div className="relative z-[2] px-4 py-4 font-mono">
        <ol aria-live="polite" aria-relevant="additions" className="space-y-0.5">
          {lines.map((l) => (
            <li key={l.id} className="whitespace-pre-wrap break-words">
              {l.kind === 'prompt' ? (
                <span>
                  <span className="text-magenta">indu@secops</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-phos">~</span>
                  <span className="text-slate-500">$ </span>
                  <span className="text-slate-100">{l.text}</span>
                </span>
              ) : l.kind === 'success' ? (
                <span className="text-phos glow-text">{l.text}</span>
              ) : l.kind === 'error' ? (
                <span className="text-magenta">{l.text}</span>
              ) : l.kind === 'ascii' ? (
                <pre className="text-phos glow-text">{l.text}</pre>
              ) : (
                <span className="text-slate-300">{l.text}</span>
              )}
            </li>
          ))}
        </ol>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = input;
            setInput('');
            setHistIdx(-1);
            if (v.trim()) setHistory((h) => [...h, v]);
            run(v);
          }}
          className="mt-2 flex items-baseline gap-1"
        >
          <span aria-hidden className="text-magenta">indu@secops</span>
          <span aria-hidden className="text-slate-500">:</span>
          <span aria-hidden className="text-phos">~</span>
          <span aria-hidden className="text-slate-500">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Command input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 border-0 bg-transparent text-slate-100 caret-phos outline-none placeholder:text-slate-600"
            placeholder="type help …"
          />
        </form>

        {completions.length > 0 && input.trim() && completions.length > 1 ? (
          <div className="mt-2 flex flex-wrap gap-1 text-tiny uppercase tracking-[0.12em]">
            {completions.map((c) => (
              <button
                key={c}
                type="button"
                className="rounded-sm border border-phos/20 bg-ink-800 px-1.5 py-0.5 text-phos/80 hover:border-phos/70"
                onClick={() => setInput(c + ' ')}
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}

        <div ref={endRef} />
      </div>
    </section>
  );
}
