import { profile } from '@content/profile';
import { cn } from '@/lib/cn';

interface AsciiBannerProps {
  /** Use the compact single-line banner (default: false = full figlet). */
  compact?: boolean;
  /** Optional subtitle rendered immediately below the banner. */
  subtitle?: string;
  className?: string;
  /** Accent class — `phos` | `magenta` | `amber`. Defaults to phos. */
  accent?: 'phos' | 'magenta' | 'amber';
}

const ACCENT_CLASS: Record<NonNullable<AsciiBannerProps['accent']>, string> = {
  phos:    'text-phos/90 glow-text',
  magenta: 'text-magenta glow-text-magenta',
  amber:   'text-amber-300 glow-text-amber',
};

export function AsciiBanner({ compact, subtitle, className, accent = 'phos' }: AsciiBannerProps) {
  const text = compact ? profile.asciiBannerSmall : profile.asciiBanner;
  return (
    <div className={cn('select-none overflow-x-auto no-scrollbar', className)} aria-hidden>
      <pre className={cn('ascii', ACCENT_CLASS[accent])}>{text}</pre>
      {subtitle && (
        <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">
          {subtitle}
        </p>
      )}
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
