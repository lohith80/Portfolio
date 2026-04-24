import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { profile } from '@content/profile';
import { roles } from '@content/experience';
import { certs } from '@content/certs';

export const metadata: Metadata = {
  title: 'experience — git log',
  description: `${profile.yearsExperience}+ years across SOC, IR, detection engineering, AppSec, and cloud — as a commit log.`,
};

function hashFor(id: string, offset = 0) {
  let h = offset;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, '0').slice(0, 7);
}

const BULLET_TYPE = ['feat', 'fix', 'perf', 'chore', 'refactor', 'docs'];

export default function ExperiencePage() {
  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6">
        <PageBanner
          cmd="git log --graph --decorate career/main"
          cwd="~"
          caption={`${roles.length} commits · ${profile.yearsExperience}y · HEAD → current`}
        />
      </header>

      <div className="tty">
        <div className="tty-titlebar">
          <span>career/main — commit log</span>
          <span>{roles.length} commits</span>
        </div>
        <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
          {roles.map((r, i) => {
            const head = i === 0;
            return (
              <span key={r.id}>
                <span className="text-amber-300">{`commit ${hashFor(r.id)}`}</span>
                {head && <span className="text-phos"> (HEAD → main, tag: current)</span>}
                {!head && <span className="text-slate-600">{` (tag: ${r.id})`}</span>}
                {'\n'}
                <span className="text-slate-500">Author: </span>
                <span className="text-slate-200">{profile.name} {'<'}{profile.email}{'>'}</span>
                {'\n'}
                <span className="text-slate-500">Date:   </span>
                <span className="text-slate-200">{r.start} → {r.end}</span>
                <span className="text-slate-600">  ·  {r.location}</span>
                {'\n\n'}
                <span className="text-slate-100">    {r.title} @ {r.company}</span>
                {'\n\n'}
                <span className="text-slate-400">    {r.summary}</span>
                {'\n\n'}
                {r.bullets.map((b, j) => {
                  const kind = BULLET_TYPE[j % BULLET_TYPE.length];
                  return (
                    <span key={j}>
                      <span className="text-slate-500">    </span>
                      <span className={kind === 'feat' ? 'text-phos' : kind === 'fix' ? 'text-magenta' : kind === 'perf' ? 'text-amber-300' : 'text-slate-500'}>
                        {kind}
                      </span>
                      <span className="text-slate-500">: </span>
                      <span className="text-slate-300">{b}</span>
                      {'\n'}
                    </span>
                  );
                })}
                {'\n'}
                <span className="text-slate-600">    stack: </span>
                <span className="text-slate-500">{r.stack.join(' · ')}</span>
                {'\n\n'}
                {i < roles.length - 1 && <span className="text-slate-700">{'│\n│\n'}</span>}
              </span>
            );
          })}
        </pre>
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
            <span className="text-slate-300">Prathyusha Engineering College — India</span>
            {'\n'}
          </pre>
        </div>
      </section>

    </div>
  );
}
