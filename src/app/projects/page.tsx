import Link from 'next/link';
import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { projects } from '@content/projects';

export const metadata: Metadata = {
  title: 'projects — ls -la',
  description:
    'Detection engineering, SOAR automation, cloud security baselines, AppSec tooling, research. Every project links to a full case study.',
};

const STATUS_COLOR = {
  shipped: 'text-phos',
  active:  'text-amber-300',
  research: 'text-magenta',
} as const;

const STATUS_PERM = {
  shipped:  '-rwxr-xr-x',
  active:   '-rw-r--r--',
  research: '-rw-------',
} as const;

const DOMAIN_COLOR: Record<string, string> = {
  detection:  'text-phos',
  appsec:     'text-magenta',
  cloud:      'text-amber-300',
  automation: 'text-phos',
  research:   'text-magenta',
};

export default function ProjectsPage() {
  // Group by domain for a secondary listing
  const byDomain = projects.reduce<Record<string, typeof projects>>((acc, p) => {
    const primary = p.domain[0];
    acc[primary] = acc[primary] || [];
    acc[primary].push(p);
    return acc;
  }, {});

  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6">
        <PageBanner cmd="ls -la ~/projects" caption={`${projects.length} projects · sorted by ctime desc`} />
      </header>

      {/* Tree view */}
      <div className="tty">
        <div className="tty-titlebar">
          <span>~/projects — tree</span>
          <span>{projects.length} items</span>
        </div>
        <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.75]">
          <span className="text-slate-500">projects/</span>
          {'\n'}
          {Object.entries(byDomain).map(([domain, list], i, arr) => {
            const last = i === arr.length - 1;
            return (
              <span key={domain}>
                <span className="text-slate-500">{last ? '└── ' : '├── '}</span>
                <span className={DOMAIN_COLOR[domain] ?? 'text-phos'}>{domain}/</span>
                <span className="text-slate-600">  ({list.length})</span>
                {'\n'}
                {list.map((p, j) => {
                  const sub = last ? '    ' : '│   ';
                  const lastChild = j === list.length - 1;
                  return (
                    <span key={p.slug}>
                      <span className="text-slate-500">{sub}{lastChild ? '└── ' : '├── '}</span>
                      <Link
                        href={`/projects/${p.slug}`}
                        className={`${accentColor(p.accent)} underline decoration-dotted underline-offset-4`}
                      >
                        {p.slug}.mdx
                      </Link>
                      <span className="text-slate-600"> — </span>
                      <span className="text-slate-300">{p.tagline}</span>
                      {'\n'}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </pre>
      </div>

      {/* Detail ls -la */}
      <div className="tty mt-6">
        <div className="tty-titlebar">
          <span>ls -la — long format</span>
          <span>perm · size · role · slug · tagline</span>
        </div>
        <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.75]">
          <span className="text-slate-500">total {projects.length}</span>
          {'\n'}
          {projects.map((p) => {
            const perm = STATUS_PERM[p.status];
            const size = String(p.summary.length + p.stack.join('').length + 512).padStart(5);
            return (
              <span key={p.slug}>
                <span className="text-slate-600">{perm}  </span>
                <span className="text-slate-500 tnum">{size} </span>
                <span className="text-slate-600">{` ${p.role.padEnd(11)} `}</span>
                <Link
                  href={`/projects/${p.slug}`}
                  className={`${accentColor(p.accent)} underline decoration-dotted underline-offset-4`}
                >
                  {p.slug}.mdx
                </Link>
                <span className="text-slate-500"> — </span>
                <span className="text-slate-200">{p.title}</span>
                <span className="text-slate-600"> · {p.tagline}</span>
                {'\n'}
                <span className="text-slate-700">{'                              '}stack: </span>
                <span className="text-slate-500">{p.stack.slice(0, 6).join(' · ')}</span>
                {p.stack.length > 6 && <span className="text-slate-600">{` +${p.stack.length - 6}`}</span>}
                {'\n'}
                <span className="text-slate-700">{'                              '}metrics: </span>
                <span className={STATUS_COLOR[p.status]}>{p.metrics.map((m) => `${m.label}=${m.value}`).join(' · ')}</span>
                {'\n\n'}
              </span>
            );
          })}
        </pre>
      </div>

      <footer className="mt-6 border-t border-phos/15 pt-4 text-[12px] text-slate-500">
        <span className="text-magenta">#</span> add one → edit{' '}
        <code className="border border-phos/20 bg-ink-900 px-1 text-phos">content/projects.ts</code>{' '}
        + create{' '}
        <code className="border border-phos/20 bg-ink-900 px-1 text-phos">content/projects/&lt;slug&gt;.mdx</code>
      </footer>
    </div>
  );
}

function accentColor(accent: 'phos' | 'magenta' | 'amber') {
  return accent === 'magenta' ? 'text-magenta' : accent === 'amber' ? 'text-amber-300' : 'text-phos';
}
