'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

type Lang = 'KQL' | 'SPL' | 'Sigma' | 'Bash' | 'Python' | 'YAML' | 'JSON' | 'TS' | 'JS';

const ACCENT: Record<Lang, string> = {
  KQL:    'text-phos border-phos/40',
  SPL:    'text-amber-300 border-amber/40',
  Sigma:  'text-magenta border-magenta/40',
  Bash:   'text-slate-300 border-slate-500/40',
  Python: 'text-phos border-phos/40',
  YAML:   'text-magenta border-magenta/40',
  JSON:   'text-slate-300 border-slate-500/40',
  TS:     'text-phos border-phos/40',
  JS:     'text-amber-300 border-amber/40',
};

interface CodeBlockProps {
  lang: Lang;
  /** Short label next to the lang — e.g. the detection ID or file path. */
  title?: string;
  /** Raw code body. Whitespace preserved. */
  code: string;
  /** Optional footer note rendered under the block. */
  note?: string;
  className?: string;
  /** Show a copy button (default true). */
  copyable?: boolean;
}

export function CodeBlock({ lang, title, code, note, className, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* denied */ }
  };

  return (
    <div className={cn('tty my-4', className)}>
      <div className="tty-titlebar">
        <div className="flex items-center gap-2">
          <span className={cn('border px-1.5 py-px text-[10px] tracking-[0.18em]', ACCENT[lang])}>
            {lang}
          </span>
          {title && <span className="truncate text-slate-400 normal-case tracking-normal">{title}</span>}
        </div>
        {copyable && (
          <button
            type="button"
            onClick={onCopy}
            className="text-phos/80 hover:text-phos"
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          >
            {copied ? 'copied ✓' : 'copy'}
          </button>
        )}
      </div>
      <pre className="tty-body overflow-x-auto text-[12px] leading-[1.6] text-slate-200">
        <code>{code}</code>
      </pre>
      {note && (
        <div className="border-t border-phos/15 bg-ink-950/60 px-3 py-1.5 text-[11px] text-slate-500">
          <span className="text-magenta">#</span> {note}
        </div>
      )}
    </div>
  );
}
