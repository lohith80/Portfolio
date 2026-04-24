import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { skillGroups } from '@content/skills';

export const metadata: Metadata = {
  title: 'skills — grep -r',
  description:
    'Detection engineering, IR, cloud security, AppSec, automation — grouped by domain with depth indicators.',
};

const LEVEL_BAR: Record<string, string> = {
  expert:   '▓▓▓▓',
  strong:   '▓▓▓░',
  working:  '▓▓░░',
  familiar: '▓░░░',
};

const LEVEL_COLOR: Record<string, string> = {
  expert:   'text-phos',
  strong:   'text-phos/80',
  working:  'text-amber-300',
  familiar: 'text-slate-400',
};

const ACCENT: Record<string, string> = {
  phos:    'text-phos',
  magenta: 'text-magenta',
  amber:   'text-amber-300',
};

export default function SkillsPage() {
  const total = skillGroups.reduce((a, g) => a + g.skills.length, 0);

  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6">
        <PageBanner
          cmd={`grep -rn "level" ~/skills/*.yml | wc -l → ${total}`}
          caption={`${skillGroups.length} domains · ${total} entries · depth-graded`}
        />
      </header>

      {/* Legend */}
      <div className="tty mb-6">
        <div className="tty-titlebar">
          <span>legend — depth</span>
          <span>bar · label · meaning</span>
        </div>
        <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
          <span className="text-phos">▓▓▓▓</span> <span className="text-slate-200">expert</span>   <span className="text-slate-500"> daily driver · rules the team follows me on</span>{'\n'}
          <span className="text-phos/80">▓▓▓░</span> <span className="text-slate-200">strong</span>   <span className="text-slate-500"> confident · production-shipped</span>{'\n'}
          <span className="text-amber-300">▓▓░░</span> <span className="text-slate-200">working</span>  <span className="text-slate-500"> have shipped with it</span>{'\n'}
          <span className="text-slate-400">▓░░░</span> <span className="text-slate-200">familiar</span> <span className="text-slate-500"> can reason, will ramp quickly</span>{'\n'}
        </pre>
      </div>

      {/* Domains */}
      <div className="space-y-5">
        {skillGroups.map((group) => (
          <section key={group.id} className="tty">
            <div className="tty-titlebar flex-wrap gap-y-1">
              <div className="flex items-center gap-2">
                <span className={ACCENT[group.accent]}>●</span>
                <span className="text-slate-200 normal-case tracking-normal">{group.label}</span>
              </div>
              <span>{group.skills.length} entries</span>
            </div>
            <pre className="tty-body overflow-x-auto text-[12px] leading-[1.75]">
              {group.skills.map((s, i) => (
                <span key={i}>
                  <span className={LEVEL_COLOR[s.level]}>{LEVEL_BAR[s.level]}</span>
                  <span className="text-slate-600"> </span>
                  <span className={`${LEVEL_COLOR[s.level]} inline-block w-[9ch] text-[10px] uppercase tracking-[0.18em]`}>
                    {s.level}
                  </span>
                  <span className="text-slate-600"> │ </span>
                  <span className="text-slate-200">{s.name}</span>
                  {s.note && (
                    <>
                      <span className="text-slate-600"> — </span>
                      <span className="text-slate-500">{s.note}</span>
                    </>
                  )}
                  {'\n'}
                </span>
              ))}
            </pre>
          </section>
        ))}
      </div>

    </div>
  );
}
