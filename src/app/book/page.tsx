import type { Metadata } from 'next';
import { PageBanner } from '@/components/AsciiBanner';
import { CalEmbed } from '@/components/CalEmbed';
import { profile } from '@content/profile';

export const metadata: Metadata = {
  title: 'book — meet',
  description:
    'Book a 15 or 30 minute Google Meet. Cal.com embed — calendar integrated, no back-and-forth.',
};

export default function BookPage() {
  return (
    <div className="wrap-wide pt-4 pb-10 sm:pt-6">
      <header className="mb-6 max-w-2xl">
        <PageBanner
          cmd="./book.sh --type 30min --provider google-meet"
          cwd="~"
          caption="cal.com embed · auto-creates meet link · blocks calendar"
        />
        <p className="mt-3 text-[13px] text-slate-400">
          <span className="text-slate-500">// </span>
          Pick any free slot. A Google Meet link drops into the confirmation email. No API keys, no
          back-and-forth, no marketing funnel. If nothing below works, mail{' '}
          <a href={`mailto:${profile.email}`} className="text-phos">{profile.email}</a> and I will
          find something that does.
        </p>
      </header>
      <div className="tty">
        <div className="tty-titlebar">
          <span>cal.com embed</span>
          <span>type=30min · tz=auto · cam=off-by-default</span>
        </div>
        <div className="tty-body p-2">
          <CalEmbed slug="30min" />
        </div>
      </div>
    </div>
  );
}
