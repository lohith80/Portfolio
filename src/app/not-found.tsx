import Link from 'next/link';
import { profile } from '@content/profile';

export default function NotFound() {
  return (
    <div className="wrap-wide flex min-h-[70vh] items-center justify-center py-16">
      <div className="tty crt w-full max-w-3xl">
        <div className="tty-titlebar">
          <span className="tty-dots">
            <span className="bg-sev-crit" />
            <span className="bg-amber" />
            <span className="bg-phos" />
          </span>
          <span>tty1 — stderr</span>
        </div>
        <pre className="tty-body text-[12.5px] leading-[1.7]">
          <span className="text-slate-500">$ </span><span className="text-phos">cat /requested/path</span>{'\n'}
          <span className="text-sev-crit">cat: /requested/path: No such file or directory</span>{'\n\n'}
          <span className="text-slate-500">$ </span><span className="text-phos">dmesg | tail -n 3</span>{'\n'}
          <span className="text-amber-300">[ERR  ]</span> <span className="text-slate-300">HTTP 404 · path not in routing table</span>{'\n'}
          <span className="text-amber-300">[ERR  ]</span> <span className="text-slate-300">no detection fired — just a bad URL</span>{'\n'}
          <span className="text-phos">[HINT ]</span> <span className="text-slate-300">try one of the destinations below</span>{'\n'}
          <span className="annot pl-10">wrong drawer — nothing filed here ↓</span>{'\n'}
          <span className="ascii-sm text-magenta">{`
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═████╗██║  ██║
 ███████║██║██╔██║███████║
 ╚════██║████╔╝██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝`}</span>
          {'\n\n'}
          <span className="text-slate-500">$ </span><span className="text-phos">ls /destinations</span>{'\n\n'}
          <span className="text-slate-600">drwxr-xr-x  </span>
          <Link href="/" className="text-phos underline decoration-dotted">./</Link>
          <span className="text-slate-500">            — </span>
          <span className="text-slate-300">whoami / home</span>
          {'\n'}
          <span className="text-slate-600">drwxr-xr-x  </span>
          <Link href="/detections" className="text-phos underline decoration-dotted">detections/</Link>
          <span className="text-slate-500">  — </span>
          <span className="text-slate-300">raw SPL / KQL / Sigma rules</span>
          {'\n'}
          <span className="text-slate-600">drwxr-xr-x  </span>
          <Link href="/projects" className="text-phos underline decoration-dotted">projects/</Link>
          <span className="text-slate-500">    — </span>
          <span className="text-slate-300">case studies</span>
          {'\n'}
          <span className="text-slate-600">drwxr-xr-x  </span>
          <Link href="/attack-matrix" className="text-phos underline decoration-dotted">attack/</Link>
          <span className="text-slate-500">      — </span>
          <span className="text-slate-300">MITRE heatmap</span>
          {'\n'}
          <span className="text-slate-600">drwxr-xr-x  </span>
          <Link href="/triage" className="text-magenta underline decoration-dotted">triage/</Link>
          <span className="text-slate-500">      — </span>
          <span className="text-slate-300">live-fire IR simulator</span>
          {'\n'}
          <span className="text-slate-600">drwxr-xr-x  </span>
          <Link href="/book" className="text-magenta underline decoration-dotted">book/</Link>
          <span className="text-slate-500">        — </span>
          <span className="text-slate-300">meet · {profile.email}</span>
          {'\n'}
        </pre>
      </div>
    </div>
  );
}
