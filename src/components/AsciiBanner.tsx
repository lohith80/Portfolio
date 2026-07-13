import { profile } from '@content/profile';
import { cn } from '@/lib/cn';

/**
 * Hero nameplate — the case-file "SUBJECT" header.
 *
 * Replaces the old ASCII figlet (a 148-char-wide block that rendered the name
 * illegibly and got half-covered by the release stamp). A dossier types the
 * subject's name plainly, so we do too: large, high-contrast, unmistakable —
 * with the stamp parked in the right margin, clear of every letter.
 */
export function AsciiBanner({ className }: { className?: string }) {
  const parts = profile.name.split(' ');
  const lead = parts.slice(0, -1).join(' '); // "Indu Lohith"
  const last = parts[parts.length - 1];      // "Narisetty"

  return (
    <div className={cn('relative', className)}>
      {/* file-header strip */}
      <div className="flex items-center justify-between border border-b-0 border-[var(--edge)] bg-[var(--paper-2)] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-slate-500">
        <span>Records Division · Personnel File</span>
        <span className="hidden sm:inline">File No. RD-04-B-07</span>
      </div>

      {/* subject block */}
      <div className="relative overflow-hidden border border-[var(--edge)] bg-[var(--paper)] px-4 py-5 shadow-[inset_0_0_44px_rgba(120,96,56,0.06)] sm:px-6 sm:py-6">
        {/* release stamp — parked in the right margin, never over the name */}
        <span className="stamp stamp-lg absolute right-4 top-6 z-10 hidden rotate-[-8deg] lg:inline-block">
          approved for release
        </span>

        <p className="text-[11px] uppercase tracking-[0.36em] text-magenta">Subject</p>

        <h1
          id="hero"
          className="mt-1.5 font-display font-bold uppercase leading-[0.98] tracking-[0.015em] text-slate-100"
          style={{ fontSize: 'clamp(1.85rem, 6.2vw, 3.5rem)' }}
        >
          <span className="whitespace-nowrap">{lead}</span>{' '}
          <span className="whitespace-nowrap">{last}</span>
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] uppercase tracking-[0.18em] text-phos sm:text-[13px]">
          <span>AI Detection Engineer</span>
          <span className="text-slate-500" aria-hidden>·</span>
          <span>SOC</span>
          <span className="text-slate-500" aria-hidden>·</span>
          <span>Incident Response</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Small inline page banner — e.g.
 *   ## /projects
 *   ## ls -la content/projects
 */
export function PageBanner({
  cmd,
  cwd,
  caption,
  className,
}: {
  cmd: string;
  cwd?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn('font-mono', className)}>
      <div className="flex items-baseline gap-2 text-[13px] sm:text-sm">
        <span className="text-magenta">{profile.handle}</span>
        <span className="text-slate-500">@</span>
        <span className="text-phos">{profile.host}</span>
        <span className="text-slate-500">:</span>
        <span className="text-slate-300">{cwd ?? '~'}</span>
        <span className="text-magenta">$</span>
        <span className="text-slate-100">{cmd}</span>
      </div>
      {caption && (
        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
          <span className="text-magenta">#</span> {caption}
        </p>
      )}
    </div>
  );
}
