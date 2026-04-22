'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  type Coverage,
  type Tactic,
  type Technique,
  techniques as ALL,
  TACTIC_LABEL,
  COVERAGE_META,
} from '@content/attack-techniques';

const TACTIC_ORDER: Tactic[] = [
  'initial-access',
  'execution',
  'persistence',
  'privilege-escalation',
  'defense-evasion',
  'credential-access',
  'discovery',
  'lateral-movement',
  'collection',
  'command-control',
  'exfiltration',
  'impact',
];

export function AttackMatrix({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<Coverage | 'all'>('all');
  const [active, setActive] = useState<Technique | null>(null);

  const grouped = useMemo(() => {
    const map: Record<Tactic, Technique[]> = Object.fromEntries(
      TACTIC_ORDER.map((t) => [t, [] as Technique[]]),
    ) as Record<Tactic, Technique[]>;
    for (const t of ALL) {
      if (filter !== 'all' && t.coverage !== filter) continue;
      map[t.tactic].push(t);
    }
    return map;
  }, [filter]);

  const stats = useMemo(() => {
    const base = { detect: 0, hunt: 0, investigate: 0, aware: 0 };
    ALL.forEach((t) => (base[t.coverage] += 1));
    return base;
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip label={`all · ${ALL.length}`} on={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterChip
          label={`detect · ${stats.detect}`}
          on={filter === 'detect'}
          color="phos"
          onClick={() => setFilter(filter === 'detect' ? 'all' : 'detect')}
        />
        <FilterChip
          label={`hunt · ${stats.hunt}`}
          on={filter === 'hunt'}
          color="magenta"
          onClick={() => setFilter(filter === 'hunt' ? 'all' : 'hunt')}
        />
        <FilterChip
          label={`investigate · ${stats.investigate}`}
          on={filter === 'investigate'}
          color="amber"
          onClick={() => setFilter(filter === 'investigate' ? 'all' : 'investigate')}
        />
        <FilterChip
          label={`familiar · ${stats.aware}`}
          on={filter === 'aware'}
          onClick={() => setFilter(filter === 'aware' ? 'all' : 'aware')}
        />
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block">
        <div
          className="overflow-x-auto scroll-shadow no-scrollbar"
          role="region"
          aria-label="MITRE ATT&amp;CK coverage matrix"
        >
          <div
            className="inline-grid min-w-full gap-2"
            style={{ gridTemplateColumns: `repeat(${TACTIC_ORDER.length}, minmax(160px, 1fr))` }}
          >
            {TACTIC_ORDER.map((t) => (
              <div
                key={t}
                className="rounded-sm border-b border-phos/30 pb-2 text-tiny uppercase tracking-[0.12em] text-phos/80"
              >
                {TACTIC_LABEL[t]}
              </div>
            ))}
            {TACTIC_ORDER.map((t) => {
              const items = grouped[t];
              return (
                <div key={`col-${t}`} className="flex flex-col gap-1.5">
                  {items.map((tech) => (
                    <TechCell
                      key={tech.id}
                      tech={tech}
                      onClick={() => setActive(tech)}
                      compact={compact}
                    />
                  ))}
                  {items.length === 0 ? (
                    <div className="h-8 rounded-sm border border-dashed border-ink-600" aria-hidden />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden">
        <ul className="space-y-2">
          {TACTIC_ORDER.map((t) => {
            const items = grouped[t];
            if (items.length === 0 && filter !== 'all') return null;
            return (
              <li key={t} className="rounded-sm border border-ink-600/60 bg-ink-900/60">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-tiny uppercase tracking-[0.18em] text-phos/80">
                    <span>{TACTIC_LABEL[t]}</span>
                    <span className="text-slate-500">{items.length}</span>
                  </summary>
                  <div className="flex flex-col gap-1.5 border-t border-ink-600/50 p-2">
                    {items.map((tech) => (
                      <TechCell key={tech.id} tech={tech} onClick={() => setActive(tech)} compact={compact} />
                    ))}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-3 text-tiny uppercase tracking-[0.14em] text-slate-400">
        <span>coverage:</span>
        {(Object.keys(COVERAGE_META) as Coverage[]).map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <span className={cn('inline-block h-3 w-3 rounded-sm', COVERAGE_META[c].bar)} />
            {COVERAGE_META[c].label}
          </span>
        ))}
      </div>

      {/* Detail drawer */}
      {active ? (
        <DetailModal tech={active} onClose={() => setActive(null)} />
      ) : null}
    </div>
  );
}

function FilterChip({
  label,
  on,
  onClick,
  color,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  color?: 'phos' | 'magenta' | 'amber';
}) {
  const accent = color === 'magenta'
    ? 'border-magenta/60 text-magenta'
    : color === 'amber'
    ? 'border-amber-400/60 text-amber-300'
    : 'border-phos/60 text-phos';
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        'rounded-sm border px-2.5 py-1 text-tiny uppercase tracking-[0.14em] transition',
        on ? `${accent} bg-ink-800` : 'border-ink-600 text-slate-400 hover:text-slate-200',
      )}
    >
      {label}
    </button>
  );
}

function TechCell({ tech, onClick, compact }: { tech: Technique; onClick: () => void; compact?: boolean }) {
  const meta = COVERAGE_META[tech.coverage];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-sm border px-2 py-1.5 text-left transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phos',
        meta.colorClass,
        'hover:-translate-y-[1px] hover:shadow-phos-sm',
      )}
      aria-label={`${tech.id} ${tech.name} — ${meta.label}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-tiny">{tech.id}</span>
        <span className={cn('ml-auto inline-block h-1.5 w-6 rounded-sm', meta.bar)} />
      </div>
      <div className={cn('mt-0.5 truncate font-mono', compact ? 'text-xs' : 'text-sm')}>{tech.name}</div>
      {!compact ? (
        <div className="mt-1 truncate text-tiny text-ink-950/80">{tech.tooling.slice(0, 2).join(' · ')}</div>
      ) : null}
    </button>
  );
}

function DetailModal({ tech, onClose }: { tech: Technique; onClose: () => void }) {
  const meta = COVERAGE_META[tech.coverage];
  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="tech-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-sm border border-phos/40 bg-ink-900 shadow-phos animate-slideUp">
        <header className="flex items-center justify-between border-b border-ink-600 bg-ink-800 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-tiny text-phos">{tech.id}</span>
            <span className="text-slate-500">·</span>
            <h3 id="tech-title" className="font-mono text-sm text-slate-100">
              {tech.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm px-2 py-0.5 text-slate-400 hover:text-phos"
            aria-label="Close"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>
        <div className="space-y-4 px-4 py-4 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-tiny uppercase tracking-[0.14em]">
            <span className={cn('rounded-sm border px-2 py-0.5', meta.colorClass)}>{meta.label}</span>
            {tech.tooling.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <p className="leading-relaxed text-slate-300">{tech.note}</p>
          {tech.query ? (
            <div>
              <div className="mb-1.5 text-tiny uppercase tracking-[0.18em] text-magenta">
                {tech.query.lang} sample
              </div>
              <pre className="overflow-x-auto rounded-sm border border-ink-600 bg-ink-950 p-3 text-xs text-slate-100">
                <code>{tech.query.snippet}</code>
              </pre>
            </div>
          ) : null}
          <p className="text-tiny text-slate-500">
            Snippets are representative, not verbatim production queries. Field names, indexes, and lookups
            reflect typical enterprise taxonomies.
          </p>
        </div>
      </div>
    </div>
  );
}
