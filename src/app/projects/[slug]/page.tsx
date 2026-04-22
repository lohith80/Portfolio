import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/components/MDXContent';
import { PageBanner } from '@/components/AsciiBanner';
import { projects } from '@content/projects';
import { listProjectSlugs, readProjectMdx } from '@/lib/content';

export async function generateStaticParams() {
  const slugs = await listProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Not found' };
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline },
  };
}

const ACCENT_TEXT: Record<'phos' | 'magenta' | 'amber', string> = {
  phos: 'text-phos',
  magenta: 'text-magenta',
  amber: 'text-amber-300',
};

const STATUS_CLASS: Record<string, string> = {
  shipped: 'chip',
  active: 'chip-amber',
  research: 'chip-magenta',
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const mdx = await readProjectMdx(slug);
  if (!project || !mdx) notFound();

  return (
    <article className="wrap-wide pt-4 pb-10 sm:pt-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-[11px] uppercase tracking-[0.18em] text-slate-500">
        <span className="text-magenta">$ </span>
        <span className="text-phos">cd </span>
        <Link href="/projects" className="text-phos no-underline hover:underline">~/projects</Link>
        <span className="text-slate-500"> && cat </span>
        <span className="text-slate-200">{project.slug}.mdx</span>
      </nav>

      <header className="tty mb-6">
        <div className="tty-titlebar flex-wrap gap-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={STATUS_CLASS[project.status]}>{project.status}</span>
            <span className="chip">{project.role}</span>
            {project.domain.map((d) => (
              <span key={d} className="chip-magenta">{d}</span>
            ))}
          </div>
          <span>{project.slug}.mdx</span>
        </div>
        <div className="tty-body">
          <h1 className={`font-display text-2xl sm:text-3xl ${ACCENT_TEXT[project.accent]}`}>
            <span className="text-magenta">## </span>{project.title}
          </h1>
          <p className="mt-2 max-w-3xl text-[14px] text-slate-300">{project.tagline}</p>

          {/* metrics as key=value table */}
          <dl className="mt-4 grid gap-x-6 gap-y-1 font-mono text-[12.5px] sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex gap-1.5">
                <dt className="text-phos/80">{m.label.toLowerCase().replace(/\s+/g, '_')}</dt>
                <dd className="text-slate-500">=</dd>
                <dd className={`${ACCENT_TEXT[project.accent]} font-semibold`}>{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>

          {project.attack && project.attack.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-500">ATT&amp;CK:</span>
              {project.attack.map((a) => (
                <a
                  key={a}
                  href={`https://attack.mitre.org/techniques/${a.replace('.', '/')}/`}
                  target="_blank"
                  rel="noopener"
                  className="chip-magenta no-underline"
                >
                  {a}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl">
        <MDXContent source={mdx.content} />
      </div>

      <footer className="mt-10 flex flex-wrap gap-3 border-t border-phos/15 pt-6 text-[13px]">
        <Link href="/projects" className="tty-link">← all projects</Link>
        <Link href="/book" className="tty-link-magenta">walk through this live</Link>
        {project.demo && (
          <Link href={project.demo} className="tty-link-amber">try it</Link>
        )}
        {project.repo && (
          <Link href={project.repo} className="tty-link">repo</Link>
        )}
      </footer>
    </article>
  );
}
