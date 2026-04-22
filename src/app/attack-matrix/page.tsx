import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { AttackMatrix } from '@/components/AttackMatrix';

export const metadata: Metadata = {
  title: 'attack — mitre coverage heatmap',
  description:
    'Interactive MITRE ATT&CK heatmap. Every cell = a technique with production-shipped detection logic in SPL, KQL, or Sigma.',
};

export default function AttackMatrixPage() {
  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6">
        <PageBanner
          cmd="./attack-map --view heat --filter deployed"
          cwd="~/coverage"
          caption="click any cell for tooling + representative SPL / KQL / Sigma"
        />
        <p className="mt-3 max-w-3xl text-[13px] text-slate-400">
          <span className="text-slate-500">{'// '}</span>
          Green = deployed detection. Amber = active hunt. Magenta = investigated during IR.
          Slate = not yet covered (honest).
        </p>
      </header>
      <AttackMatrix />
    </div>
  );
}
