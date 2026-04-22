import Link from 'next/link';
import type { Metadata } from 'next';
import { AsciiBanner, PageBanner } from '@/components/AsciiBanner';
import { CodeBlock } from '@/components/CodeBlock';
import { AttackMatrix } from '@/components/AttackMatrix';
import { profile } from '@content/profile';
import { projects } from '@content/projects';
import { roles } from '@content/experience';
import { certs } from '@content/certs';
import { detections } from '@content/detections';
import { skillGroups } from '@content/skills';

export const metadata: Metadata = {
  title: `${profile.name} — Detection Engineer`,
  description: profile.oneLine,
  alternates: { canonical: '/' },
};

export default function LandingPage() {
  const featured = detections.slice(0, 2);
  const flagshipProjects = projects.slice(0, 4);
  const skillCount = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);

  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      {/* ────────── ASCII banner ────────── */}
      <section aria-labelledby="hero" className="mb-6">
        <AsciiBanner />
        <h1 id="hero" className="sr-only">{profile.name} — Detection Engineer</h1>

        <div className="mt-4 grid gap-3 md:grid-cols-12">
          {/* whoami table */}
          <div className="tty md:col-span-7">
            <div className="tty-titlebar">
              <span className="tty-dots">
                <span className="bg-sev-crit" />
                <span className="bg-amber" />
                <span className="bg-phos" />
              </span>
              <span>tty1 — {profile.handle}@{profile.host}:~</span>
            </div>
            <div className="tty-body crt">
              <pre className="whitespace-pre-wrap text-[12.5px] leading-[1.75] text-slate-200">
                <span className="text-slate-500">$ </span><span className="text-phos">whoami --long</span>
                {'\n'}
                {profile.whoami.map(([k, v], i) => (
                  <span key={i}>
                    <span className="text-phos/80">{k.padEnd(12)}</span>
                    <span className="text-slate-500"> : </span>
                    <span className="text-slate-200">{v}</span>
                    {'\n'}
                  </span>
                ))}
                {'\n'}
                <span className="text-slate-500">$ </span><span className="text-phos">uptime</span>
                {'\n'}
                <span className="text-slate-300">{profile.yearsExperience} years — {roles.length} roles — {projects.length} shipped projects — {detections.length}+ production detections</span>
                {'\n\n'}
                <span className="text-slate-500">$ </span><span className="text-phos">cat ~/.motd</span>
                {'\n'}
                <span className="text-slate-300">{profile.oneLine}</span>
                <span className="caret" aria-hidden />
              </pre>
            </div>
          </div>

          {/* Quick-jump panel */}
          <aside className="tty md:col-span-5">
            <div className="tty-titlebar">
              <span>nav — press the key</span>
              <span>help: ?</span>
            </div>
            <div className="tty-body text-[13px]">
              <ul className="space-y-1 font-mono">
                <QuickKey k="1" href="/detections" label="detections"   hint={`${detections.length} rules`} />
                <QuickKey k="2" href="/projects"   label="projects"     hint={`${projects.length} case studies`} />
                <QuickKey k="3" href="/attack-matrix" label="attack"    hint="MITRE coverage heatmap" />
                <QuickKey k="4" href="/triage"     label="triage"       hint="live-fire IR simulator" accent="magenta" />
                <QuickKey k="5" href="/experience" label="experience"   hint={`${roles.length} roles · 4y`} />
                <QuickKey k="6" href="/skills"     label="skills"       hint={`${skillCount} entries`} />
                <QuickKey k="7" href="/book"       label="book"         hint="Google Meet · 15/30m" accent="magenta" />
              </ul>
              <div className="mt-3 border-t border-phos/15 pt-2 text-[11px] text-slate-500">
                <span className="text-magenta">#</span> or press <span className="kbd">g</span>{' '}
                <span className="kbd">p</span> · <span className="kbd">g</span>{' '}
                <span className="kbd">d</span> · <span className="kbd">g</span>{' '}
                <span className="kbd">t</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ────────── Detection library teaser ────────── */}
      <section aria-labelledby="det" className="mt-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <PageBanner cmd="head -n 2 detections/*.yml" cwd="~" caption="two out of the deployed library" />
            <h2 id="det" className="sr-only">Featured detections</h2>
          </div>
          <Link href="/detections" className="tty-link">view all {detections.length}</Link>
        </div>

        {featured.map((d) => (
          <div key={d.id} className="mb-4">
            <header className="mb-1 flex flex-wrap items-center gap-2 text-[12px]">
              <span className="chip-crit">{d.severity.toUpperCase()}</span>
              <span className="chip">{d.id}</span>
              <span className="text-slate-400">{d.title}</span>
              <span className="ml-auto flex flex-wrap items-center gap-1">
                {d.technique.map((t) => <span key={t} className="chip-magenta">{t}</span>)}
              </span>
            </header>
            <p className="mb-2 text-[13px] text-slate-400">
              <span className="text-slate-500">{'// '}</span>{d.description}
            </p>
            <CodeBlock
              lang={d.logic[0].lang as 'KQL' | 'SPL' | 'Sigma'}
              title={`${d.id} · ${d.dataSources[0]} · fp ${d.fpRate ?? 'n/a'} · mttr ${d.mttr ?? 'n/a'}`}
              code={d.logic[0].body}
              note={d.notes?.[0]}
            />
          </div>
        ))}
      </section>

      {/* ────────── MITRE coverage ────────── */}
      <section aria-labelledby="attack" className="mt-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <PageBanner cmd="mitre-map --view heat" cwd="~/coverage" caption="click any cell for tooling + query" />
          <Link href="/attack-matrix" className="tty-link">full matrix</Link>
        </div>
        <h2 id="attack" className="sr-only">ATT&amp;CK coverage</h2>
        <AttackMatrix compact />
      </section>

      {/* ────────── Triage console ────────── */}
      <section aria-labelledby="triage" className="mt-10">
        <PageBanner cmd="./triage.sh --scenario phishing-cred-theft" cwd="~/ir" caption="live-fire 5-step walkthrough" />
        <h2 id="triage" className="sr-only">Triage simulator</h2>
        <div className="tty crt mt-3">
          <div className="tty-titlebar">
            <span className="tty-dots">
              <span className="bg-sev-crit" />
              <span className="bg-amber" />
              <span className="bg-phos" />
            </span>
            <span>triage.sh — phishing → cred-theft → lateral</span>
          </div>
          <div className="tty-body grid gap-5 p-5 md:grid-cols-12">
            <div className="md:col-span-7">
              <pre className="whitespace-pre-wrap text-[12.5px] leading-[1.7] text-slate-300">
{`[t=00:00]  alert received  .................................. Sev: HIGH
           source          :  Defender for O365 URL Click
           user            :  a.thompson@corp.com
           technique       :  T1566.002 — Spearphishing Link

[t=00:03]  pivot           :  AAD SigninLogs on ClickIP (30m window)
           hit             :  successful auth @ +9 min from same IP
           mapped          :  T1078 Valid Accounts

[t=00:10]  decision point  :  contain / monitor / escalate ?
           your call       :  ▸ press [start] to make it`}
              </pre>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link href="/triage" className="btn-magenta">▸ start the simulation</Link>
                <span className="chip">T1566</span>
                <span className="chip">T1078</span>
                <span className="chip">T1021.002</span>
                <span className="chip">T1114</span>
              </div>
            </div>
            <div className="md:col-span-5">
              <CodeBlock
                lang="KQL"
                title="step-1.kql"
                code={`// correlate click → auth within 30m
let window = 30m;
UrlClickEvents
| where Url has_any ('contos0-security.com')
| join kind=inner SigninLogs
    on $left.IPAddress == $right.IPAddress
| where SignInTime between (ClickTime .. ClickTime + window)
| project ClickTime, SignInTime, UserPrincipalName,
          IPAddress, AutonomousSystemNumber, UserAgent`}
                copyable={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── Projects ls -la ────────── */}
      <section aria-labelledby="projs" className="mt-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <PageBanner cmd="ls -la ~/projects" caption="8 case studies — detection · appsec · cloud · automation" />
          <Link href="/projects" className="tty-link">open all</Link>
        </div>
        <h2 id="projs" className="sr-only">Projects</h2>
        <div className="tty">
          <div className="tty-titlebar">
            <span>~/projects</span>
            <span>{projects.length} items</span>
          </div>
          <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
            <span className="text-slate-500">total {projects.length}</span>
            {'\n'}
            {flagshipProjects.map((p) => (
              <LsLine key={p.slug} slug={p.slug} title={p.title} tagline={p.tagline} status={p.status} />
            ))}
            <span className="text-slate-600">{'drwxr-xr-x  '}</span>
            <span className="text-slate-500">…</span>
            {'  '}
            <Link href="/projects" className="text-phos underline decoration-dotted">[+{projects.length - flagshipProjects.length} more]</Link>
          </pre>
        </div>
      </section>

      {/* ────────── Experience git log ────────── */}
      <section aria-labelledby="xp" className="mt-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <PageBanner cmd="git log --oneline --decorate career/main" caption="most recent → earliest" />
          <Link href="/experience" className="tty-link">show --stat</Link>
        </div>
        <h2 id="xp" className="sr-only">Experience</h2>
        <div className="tty">
          <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
            {roles.map((r, i) => (
              <span key={r.id}>
                <span className="text-amber-300">{`commit ${hashFor(r.id)}`}</span>
                {i === 0 && <span className="text-phos"> (HEAD → main, current)</span>}
                {'\n'}
                <span className="text-slate-500">Author: </span>
                <span className="text-slate-200">{profile.name} {'<'}{profile.email}{'>'}</span>
                {'\n'}
                <span className="text-slate-500">Date:   </span>
                <span className="text-slate-200">{r.start} → {r.end}</span>
                {'\n\n'}
                <span className="text-slate-300">    {r.title} @ {r.company}</span>
                {'\n'}
                <span className="text-slate-400">    {r.summary}</span>
                {'\n\n'}
              </span>
            ))}
          </pre>
        </div>
      </section>

      {/* ────────── Certs ────────── */}
      <section aria-labelledby="certs" className="mt-10">
        <PageBanner cmd="cat ~/.certs" caption={`${certs.filter((c) => c.status !== 'pursuing').length} active · ${certs.filter((c) => c.status === 'pursuing').length} pursuing`} />
        <h2 id="certs" className="sr-only">Certifications</h2>
        <div className="tty mt-3">
          <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
            {certs.map((c) => (
              <span key={c.id}>
                <span className={c.status === 'active' ? 'text-phos' : 'text-amber-300'}>
                  {c.status === 'active' ? '●' : '○'}
                </span>{' '}
                <span className="text-slate-200">{c.abbr.padEnd(10)}</span>
                <span className="text-slate-500"> │ </span>
                <span className="text-slate-300">{c.name}</span>
                <span className="text-slate-600"> — {c.issuer}</span>
                {c.verifyUrl && c.verifyUrl !== '#' && (
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

      {/* ────────── Contact — TTY style ────────── */}
      <section aria-labelledby="contact" className="mt-10">
        <PageBanner cmd="contact --all" caption="booking · email · socials · PGP (on request)" />
        <h2 id="contact" className="sr-only">Contact</h2>
        <div className="tty mt-3">
          <pre className="tty-body overflow-x-auto text-[12.5px] leading-[1.7]">
            <span className="text-slate-500">email     </span>
            <span className="text-slate-500"> : </span>
            <a href={`mailto:${profile.email}`} className="text-phos">{profile.email}</a>
            {'\n'}
            <span className="text-slate-500">linkedin  </span>
            <span className="text-slate-500"> : </span>
            <a href={profile.linkedin} target="_blank" rel="noopener" className="text-phos">
              {profile.linkedin.replace('https://', '')}
            </a>
            {'\n'}
            <span className="text-slate-500">github    </span>
            <span className="text-slate-500"> : </span>
            <a href={profile.github} target="_blank" rel="noopener" className="text-phos">
              {profile.github.replace('https://', '')}
            </a>
            {'\n'}
            <span className="text-slate-500">resume    </span>
            <span className="text-slate-500"> : </span>
            <Link href="/resume.pdf" prefetch={false} className="text-phos">/resume.pdf</Link>
            {'\n'}
            <span className="text-slate-500">book      </span>
            <span className="text-slate-500"> : </span>
            <Link href="/book" className="text-magenta">[/book]</Link>
            <span className="text-slate-600"> — Google Meet · 15 or 30 min · Cal.com</span>
            {'\n'}
          </pre>
        </div>
      </section>
    </div>
  );
}

function QuickKey({
  k, href, label, hint, accent,
}: {
  k: string; href: string; label: string; hint?: string; accent?: 'magenta';
}) {
  return (
    <li className="flex items-center gap-2">
      <span className="kbd">{k}</span>
      <Link
        href={href}
        className={`no-underline ${accent === 'magenta' ? 'text-magenta hover:text-white' : 'text-phos hover:text-white'}`}
      >
        <span className="text-slate-500">[</span>
        {label}
        <span className="text-slate-500">]</span>
      </Link>
      {hint && <span className="ml-auto text-[11px] text-slate-500">{hint}</span>}
    </li>
  );
}

function LsLine({ slug, title, tagline, status }: { slug: string; title: string; tagline: string; status: string }) {
  const perm = status === 'shipped' ? '-rwxr-xr-x' : status === 'active' ? '-rw-r--r--' : '-rw-------';
  const size = `${(title.length * 37 + 512).toString().padStart(5)}`;
  return (
    <>
      <span className="text-slate-600">{perm}  </span>
      <span className="text-slate-600 tnum">{size} </span>
      <span className="text-slate-500"> </span>
      <Link href={`/projects/${slug}`} className="text-phos underline decoration-dotted">
        {slug}.mdx
      </Link>
      <span className="text-slate-500"> — </span>
      <span className="text-slate-300">{title}</span>
      <span className="text-slate-600"> · {tagline}</span>
      {'\n'}
    </>
  );
}

function hashFor(id: string): string {
  // deterministic pseudo-hash for commit-log aesthetic
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, '0').slice(0, 7);
}
