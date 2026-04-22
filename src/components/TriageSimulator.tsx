'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { triageScenario, type Choice, type Step } from '@content/triage-scenario';

type Picked = Record<number, Choice['outcome']>;

const SEV_COLOR: Record<Step['alertCard']['severity'], string> = {
  critical: 'border-sev-crit text-sev-crit',
  high: 'border-sev-high text-sev-high',
  medium: 'border-sev-med text-sev-med',
  low: 'border-sev-low text-sev-low',
};

export function TriageSimulator() {
  const { steps, title, synopsis, report } = triageScenario;
  const [stepIdx, setStepIdx] = useState(0);
  const [picked, setPicked] = useState<Picked>({});
  const [revealed, setRevealed] = useState<Record<number, string>>({});
  const [showReport, setShowReport] = useState(false);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const score = Object.values(picked).filter((o) => o === 'correct').length;

  function pick(choice: Choice) {
    setPicked((p) => ({ ...p, [step.id]: choice.outcome }));
    setRevealed((r) => ({ ...r, [step.id]: choice.id }));
  }

  function next() {
    if (isLast) {
      setShowReport(true);
    } else {
      setStepIdx(stepIdx + 1);
    }
  }

  function reset() {
    setPicked({});
    setRevealed({});
    setStepIdx(0);
    setShowReport(false);
  }

  const picksForThisStep = revealed[step.id];

  return (
    <div className="space-y-5">
      <header className="rounded-sm border border-magenta/30 bg-magenta/5 p-4">
        <div className="flex flex-wrap items-center gap-2 text-tiny uppercase tracking-[0.18em] text-magenta">
          <span>live-fire triage simulation</span>
          <span aria-hidden>·</span>
          <span>no real customers harmed</span>
        </div>
        <h2 className="mt-1.5 font-display text-lg text-slate-100">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{synopsis}</p>
      </header>

      <nav
        aria-label="Triage progress"
        className="flex gap-1.5 overflow-x-auto no-scrollbar"
      >
        {steps.map((s, i) => {
          const state = picked[s.id];
          const color =
            state === 'correct'
              ? 'bg-phos/60 border-phos'
              : state === 'plausible'
              ? 'bg-amber-400/50 border-amber-400'
              : state === 'wrong'
              ? 'bg-sev-crit/60 border-sev-crit'
              : 'bg-ink-700 border-ink-600';
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => setStepIdx(i)}
              className={cn(
                'flex-shrink-0 rounded-sm border px-3 py-1.5 text-tiny uppercase tracking-[0.12em] transition',
                i === stepIdx ? 'ring-1 ring-phos' : 'opacity-70 hover:opacity-100',
                color,
                'text-ink-950',
              )}
              aria-current={i === stepIdx ? 'step' : undefined}
            >
              Step {s.id}
            </button>
          );
        })}
      </nav>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <aside className="lg:col-span-5">
          <div
            className={cn(
              'rounded-sm border bg-ink-900/80 p-4 shadow-phos-sm',
              SEV_COLOR[step.alertCard.severity],
            )}
          >
            <div className="flex items-center justify-between text-tiny uppercase tracking-[0.18em]">
              <span>{step.alertCard.source}</span>
              <span className="rounded-sm border border-current px-2 py-0.5">
                {step.alertCard.severity}
              </span>
            </div>
            <h3 className="mt-2 font-mono text-sm text-slate-100">{step.alertCard.summary}</h3>
            <dl className="mt-3 space-y-1 border-t border-ink-600/50 pt-3 text-xs">
              {step.alertCard.entities.map((e) => (
                <div key={e.label} className="grid grid-cols-3 gap-2">
                  <dt className="text-slate-500 uppercase tracking-[0.14em]">{e.label}</dt>
                  <dd className="col-span-2 break-all font-mono text-slate-200">{e.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-ink-600/50 pt-3 text-tiny uppercase tracking-[0.12em]">
              <span className="text-slate-500">ATT&amp;CK:</span>
              {step.attack.map((a) => (
                <span key={a} className="chip">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-7">
          <h3 className="section-label">step {step.id} · {step.tactic}</h3>
          <h2 className="mt-1 font-display text-xl text-phos">{step.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.narration}</p>

          {step.kql ? <QueryBlock lang="KQL" code={step.kql} /> : null}
          {step.spl ? <QueryBlock lang="SPL" code={step.spl} /> : null}

          <div className="mt-4 space-y-2">
            <h4 className="section-label">what do you do?</h4>
            {step.choices.map((c) => {
              const chosen = picksForThisStep === c.id;
              const anyChosen = Boolean(picksForThisStep);
              const outcomeBorder =
                c.outcome === 'correct'
                  ? 'border-phos'
                  : c.outcome === 'plausible'
                  ? 'border-amber-400/70'
                  : 'border-sev-crit/70';
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pick(c)}
                  disabled={anyChosen}
                  className={cn(
                    'w-full rounded-sm border bg-ink-900/60 p-3 text-left text-sm transition',
                    chosen ? `${outcomeBorder} shadow-phos-sm` : 'border-ink-600 hover:border-phos/50',
                    anyChosen && !chosen && 'opacity-60',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex h-5 w-5 items-center justify-center rounded-sm border font-mono text-xs',
                        chosen ? outcomeBorder : 'border-ink-600',
                      )}
                    >
                      {c.id.toUpperCase()}
                    </span>
                    <span className="text-slate-200">{c.label}</span>
                  </div>
                  {chosen ? (
                    <p
                      className={cn(
                        'mt-2 pl-7 leading-relaxed',
                        c.outcome === 'correct'
                          ? 'text-phos'
                          : c.outcome === 'plausible'
                          ? 'text-amber-300'
                          : 'text-sev-crit',
                      )}
                    >
                      {c.feedback}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          {picksForThisStep ? (
            <div className="mt-4 rounded-sm border border-ink-600 bg-ink-900/60 p-3 text-sm">
              <div className="text-tiny uppercase tracking-[0.18em] text-slate-500">debrief</div>
              <p className="mt-1 text-slate-300">{step.debrief}</p>
              <button
                type="button"
                onClick={next}
                className={cn('btn mt-3', isLast ? 'btn-magenta' : '')}
              >
                {isLast ? 'See final report ▸' : `Step ${step.id + 1} ▸`}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <div className="text-xs text-slate-500">
        Score so far:{' '}
        <span className="text-phos">{score}</span>
        <span className="text-slate-600"> / {steps.length}</span>
        <button type="button" onClick={reset} className="ml-3 underline decoration-ink-600 hover:text-phos">
          reset
        </button>
      </div>

      {showReport ? (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/85 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReport(false);
          }}
        >
          <div className="w-full max-w-2xl rounded-sm border border-phos/40 bg-ink-900 shadow-phos animate-slideUp">
            <header className="flex items-center justify-between border-b border-ink-600 bg-ink-800 px-4 py-2">
              <h3 className="font-mono text-sm text-phos">Post-incident report</h3>
              <button
                type="button"
                onClick={() => setShowReport(false)}
                className="text-slate-400 hover:text-phos"
                aria-label="Close"
              >
                ✕
              </button>
            </header>
            <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap border-b border-ink-600 p-4 font-mono text-xs text-slate-200">
              {report}
            </pre>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-slate-400">
                Correct decisions:{' '}
                <span className="text-phos">{score}</span> / {steps.length}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={reset} className="btn-ghost">
                  run it again
                </button>
                <a href="/book" className="btn-magenta">
                  talk through it live ▸
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function QueryBlock({ lang, code }: { lang: 'SPL' | 'KQL'; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between rounded-t-sm border border-b-0 border-ink-600 bg-ink-800 px-3 py-1.5">
        <span className="text-tiny uppercase tracking-[0.18em] text-magenta">{lang}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            } catch {
              /* no-op */
            }
          }}
          className="text-tiny uppercase tracking-[0.18em] text-slate-400 hover:text-phos"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="max-h-[360px] overflow-auto rounded-b-sm border border-ink-600 bg-ink-950 p-3 text-xs">
        <code className="text-slate-200">{code}</code>
      </pre>
    </div>
  );
}
