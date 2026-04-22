import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { TriageSimulator } from '@/components/TriageSimulator';

export const metadata: Metadata = {
  title: 'triage — live-fire IR simulator',
  description:
    'Five-step simulation: phishing → credential theft → lateral movement. Make the call at each step. See the SPL, KQL, MITRE mapping, and the post-incident report.',
};

export default function TriagePage() {
  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6 max-w-3xl">
        <PageBanner
          cmd="./triage.sh --scenario phishing-cred-theft --interactive"
          cwd="~/ir"
          caption="5 steps · make the call · your decisions are scored"
        />
        <p className="mt-3 text-[13px] text-slate-400">
          <span className="text-slate-500">// </span>
          Each step shows the alert JSON, the query (Splunk SPL + Sentinel KQL), the MITRE mapping,
          and a decision. Pick what you would do. The final debrief is the post-incident report I
          actually wrote after the real investigation this simulation is based on.
        </p>
      </header>
      <TriageSimulator />
    </div>
  );
}
