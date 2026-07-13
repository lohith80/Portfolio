import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { profile } from '@content/profile';
import { roles } from '@content/experience';
import { certs } from '@content/certs';

export const metadata: Metadata = {
  title: 'experience — service record',
  description: `${profile.yearsExperience}+ years across SOC, IR, detection engineering, AppSec, cloud, and AI/LLM security — the companies, roles, and outcomes.`,
};

export default function ExperiencePage() {
  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6">
        <PageBanner
          cmd="cat ~/.service-record"
          cwd="~"
          caption={`${roles.length} postings · ${profile.yearsExperience}+y · most recent first`}
        />
      </header>

      {/* Service record — one clearly-labelled sheet per employer */}
      <div className="space-y-6">
        {roles.map((r, i) => {
          const current = i === 0;
          return (
            <article key={r.id} className="tty scroll-mt-16">
              <div className="tty-titlebar flex-wrap gap-y-1">
                <span>posting {String(roles.length - i).padStart(2, '0')} of {String(roles.length).padStart(2, '0')}</span>
                <span className="tnum">{r.start} — {r.end}</span>
              </div>

              <div className="tty-body">
                {/* Employer — the headline, unmistakable */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="font-display text-xl uppercase leading-tight tracking-[0.02em] text-slate-100 sm:text-2xl">
                    {r.company}
                  </h2>
                  {current ? (
                    <span className="chip-crit shrink-0">current posting</span>
                  ) : (
                    <span className="chip shrink-0">former</span>
                  )}
                </div>

                {/* Role + where/when */}
                <p className="mt-1.5 text-sm uppercase tracking-[0.16em] text-phos">{r.title}</p>
                <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-slate-500">
                  {r.location}
                  <span className="text-slate-600"> · </span>
                  {r.start} — {r.end}
                </p>

                <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-slate-300">
                  {r.summary}
                </p>

                {/* Outcomes as report lines */}
                <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed">
                  {r.bullets.map((b, j) => (
                    <li key={j} className="relative max-w-3xl pl-5 text-slate-300">
                      <span className="absolute left-0 top-0 text-magenta" aria-hidden>▸</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Stack */}
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--edge-soft)] pt-3">
                  {r.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Certifications */}
      <section className="mt-8">
        <PageBanner cmd="cat ~/.certs" caption={`${certs.filter((c) => c.status === 'active').length} active · ${certs.filter((c) => c.status === 'pursuing').length} pursuing`} />
        <div className="tty mt-3">
          <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
            {certs.map((c) => (
              <span key={c.id}>
                <span className={c.status === 'active' ? 'text-phos' : 'text-amber-300'}>
                  {c.status === 'active' ? '●' : '○'}
                </span>{' '}
                <span className="text-slate-200">{c.abbr.padEnd(11)}</span>
                <span className="text-slate-500"> │ </span>
                <span className="text-slate-300">{c.name}</span>
                <span className="text-slate-600"> — {c.issuer}</span>
                {c.verifyUrl && (
                  <>
                    {' '}
                    <a href={c.verifyUrl} target="_blank" rel="noopener" className="text-phos">
                      [verify]
                    </a>
                  </>
                )}
                {'\n'}
              </span>
            ))}
          </pre>
        </div>
      </section>

      {/* Education */}
      <section className="mt-8">
        <PageBanner cmd="cat ~/.education" caption="formal training" />
        <div className="tty mt-3">
          <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
            <span className="text-phos">● </span>
            <span className="text-slate-200">M.S. Cybersecurity / Information Systems</span>
            {'\n'}
            <span className="text-slate-600">    </span>
            <span className="text-slate-300">University of Maryland — College Park, MD</span>
            {'\n'}
            <span className="text-slate-600">    Aug 2022 — May 2024 · GPA 3.87</span>
            {'\n\n'}
            <span className="text-phos">● </span>
            <span className="text-slate-200">B.Tech. Computer Science &amp; Engineering</span>
            {'\n'}
            <span className="text-slate-600">    </span>
            <span className="text-slate-300">Anna University — Chennai, India</span>
            {'\n'}
          </pre>
        </div>
      </section>

    </div>
  );
}
