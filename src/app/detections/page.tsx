import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { CodeBlock } from '@/components/CodeBlock';
import { detections, severityOrder } from '@content/detections';

export const metadata: Metadata = {
  title: 'detections — rule library',
  description:
    'Production detection rule library — SPL, KQL, and Sigma with MITRE ATT&CK mapping, false-positive rates, and playbook notes.',
};

const SEV_CLASS = {
  crit: 'chip-crit',
  high: 'chip-high',
  med: 'chip-med',
  low: 'chip',
} as const;

const STATUS_CLASS = {
  prod: 'text-phos',
  tuning: 'text-amber-300',
  experimental: 'text-magenta',
} as const;

export default function DetectionsPage() {
  const sorted = [...detections].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
  const prodCount = detections.filter((d) => d.status === 'prod').length;
  const critCount = detections.filter((d) => d.severity === 'crit').length;

  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6">
        <PageBanner
          cmd="ls -la ~/detections/"
          cwd="~"
          caption={`${detections.length} rules · ${prodCount} prod · ${critCount} crit · SPL · KQL · Sigma`}
        />
      </header>

      {/* Summary card */}
      <div className="tty crt mb-6">
        <div className="tty-titlebar">
          <span>stats — detection library</span>
          <span>{detections.length} rows</span>
        </div>
        <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
{`┌────────────┬────────┬──────────┬──────────────────────────────┐
│ severity   │ count  │ status   │ representative data sources  │
├────────────┼────────┼──────────┼──────────────────────────────┤`}
{'\n'}
{Object.keys(severityOrder).map((sev) => {
  const rows = detections.filter((d) => d.severity === sev);
  if (!rows.length) return null;
  const ds = Array.from(new Set(rows.flatMap((r) => r.dataSources))).slice(0, 3).join(', ');
  const prod = rows.filter((r) => r.status === 'prod').length;
  return (
    <span key={sev}>{`│ ${sev.padEnd(10)} │ ${String(rows.length).padEnd(6)} │ ${String(prod).padEnd(1)}/${rows.length} prod │ ${ds.slice(0, 28).padEnd(28)} │\n`}</span>
  );
})}
{`└────────────┴────────┴──────────┴──────────────────────────────┘`}
        </pre>
      </div>

      {/* Rules */}
      <section aria-label="Detection rules" className="space-y-10">
        {sorted.map((d) => (
          <article key={d.id} id={d.id} className="tty scroll-mt-16">
            <header className="tty-titlebar flex-wrap gap-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={SEV_CLASS[d.severity]}>{d.severity.toUpperCase()}</span>
                <span className="chip">{d.id}</span>
                <span className={`text-[11px] tracking-[0.16em] ${STATUS_CLASS[d.status]}`}>
                  [{d.status}]
                </span>
                <span className="truncate text-slate-300 normal-case tracking-normal">
                  {d.title}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {d.technique.map((t) => (
                  <a
                    key={t}
                    href={`https://attack.mitre.org/techniques/${t.replace('.', '/')}/`}
                    target="_blank"
                    rel="noopener"
                    className="chip-magenta no-underline"
                  >
                    {t}
                  </a>
                ))}
              </div>
            </header>

            <div className="tty-body space-y-3 p-4">
              {/* meta grid */}
              <dl className="grid gap-x-4 gap-y-1 text-[12px] sm:grid-cols-3">
                <Meta k="data_sources" v={d.dataSources.join(' · ')} />
                <Meta k="fp_rate"      v={d.fpRate ?? '—'} />
                <Meta k="mttr"         v={d.mttr ?? '—'} />
              </dl>

              <p className="text-[13px] leading-relaxed text-slate-300">
                <span className="text-slate-500">// </span>{d.description}
              </p>

              {/* queries */}
              <div className="space-y-3">
                {d.logic.map((l, i) => (
                  <CodeBlock
                    key={i}
                    lang={l.lang as 'KQL' | 'SPL' | 'Sigma' | 'Bash' | 'Python'}
                    title={`${d.id} — ${l.lang}`}
                    code={l.body}
                  />
                ))}
              </div>

              {/* ops notes */}
              {d.notes && d.notes.length > 0 && (
                <div className="border border-phos/15 bg-ink-950/60 p-3 text-[12px] text-slate-300">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-phos/70">
                    # ops notes
                  </p>
                  <ul className="space-y-1">
                    {d.notes.map((n, i) => (
                      <li key={i}>
                        <span className="text-magenta">▸</span>{' '}
                        <span className="text-slate-300">{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-10 border-t border-phos/15 pt-4 text-[12px] text-slate-500">
        <span className="text-magenta">#</span> new detection? → edit{' '}
        <code className="border border-phos/20 bg-ink-900 px-1 text-phos">content/detections.ts</code>{' '}
        → <code className="text-phos">git push</code>. live in ~45s.
      </footer>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="shrink-0 text-phos/80">{k}</dt>
      <dd className="text-slate-500">=</dd>
      <dd className="min-w-0 break-words text-slate-200">{v}</dd>
    </div>
  );
}
