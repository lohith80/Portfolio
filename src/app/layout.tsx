import type { Metadata, Viewport } from 'next';
import { Courier_Prime, Stardos_Stencil, Caveat } from 'next/font/google';
import './globals.css';
import { BootSequence } from '@/components/BootSequence';
import { TtyNav } from '@/components/TtyNav';
import { StatusBar } from '@/components/StatusBar';
import { profile } from '@content/profile';

// Typewriter body — every transcript, table, and report line.
const courier = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-mono',
});

// Stencil display — rubber stamps and dossier headings.
const stencil = Stardos_Stencil({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-display',
});

// Handwritten margin notes.
const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://indulohithnarisetty.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — AI Detection Engineer`,
    template: `%s — ${profile.name}`,
  },
  description: profile.oneLine,
  applicationName: `${profile.handle}@${profile.host}`,
  authors: [{ name: profile.name, url: profile.linkedin }],
  keywords: [
    'AI Detection Engineering',
    'Detection Engineer',
    'Detection Engineering',
    'Detection as Code',
    'Security Operations',
    'SOC Analyst',
    'Threat Hunting',
    'Threat Detection',
    'SIEM',
    'AI Security',
    'LLM Security',
    'MITRE ATLAS',
    'SecOps',
    'SOC',
    'Incident Response',
    'MITRE ATT&CK',
    'Splunk SPL',
    'Sentinel KQL',
    'Sigma',
    'CrowdStrike Falcon',
    'AWS Security',
  ],
  openGraph: {
    type: 'profile',
    title: `${profile.name} — AI Detection Engineer`,
    description: profile.oneLine,
    siteName: `${profile.handle}@${profile.host}`,
    url: SITE_URL,
    locale: 'en_US',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: `${profile.name} — AI Detection Engineer` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — AI Detection Engineer`,
    description: profile.oneLine,
    images: ['/og.svg'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#e8dcbe',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Person structured data — lets search engines surface a rich result when a
// recruiter searches the name, cross-linking LinkedIn + GitHub via sameAs.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: SITE_URL,
  image: `${SITE_URL}/og.svg`,
  jobTitle: 'AI Detection Engineer',
  email: `mailto:${profile.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Frisco',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  sameAs: [profile.linkedin, profile.github],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'University of Maryland, College Park' },
    { '@type': 'CollegeOrUniversity', name: 'Anna University' },
  ],
  knowsAbout: [
    'Detection Engineering',
    'Security Operations (SOC)',
    'Incident Response',
    'SIEM — Splunk & Microsoft Sentinel',
    'Detection-as-Code (SPL, KQL, Sigma)',
    'Threat Hunting',
    'MITRE ATT&CK',
    'AI/LLM Security',
    'MITRE ATLAS',
    'EDR — CrowdStrike Falcon & Microsoft Defender',
    'Cloud Security (AWS)',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${courier.variable} ${stencil.variable} ${caveat.variable}`}>
      <head>
        {/* Person structured data (schema.org/Person) for recruiter/name search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Preconnect to third-party origins used on page load: visitor-counter worker + Cal.com embed.
            next/font/google already handles fonts.gstatic.com preconnect automatically. */}
        <link rel="preconnect" href="https://visitor-counter.lohithchowdary80.workers.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://visitor-counter.lohithchowdary80.workers.dev" />
        <link rel="preconnect" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
      </head>
      <body className="antialiased pb-8">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:border focus:border-phos focus:bg-[var(--bg)] focus:px-3 focus:py-1.5 focus:text-phos"
        >
          Skip to content
        </a>

        {/* Global paper layers: aged-edge vignette + fiber grain */}
        <div aria-hidden className="vignette-global" />
        <div aria-hidden className="scanline-global" />

        <BootSequence>
          <TtyNav />
          <main id="main" role="main" className="pb-16">
            {children}
          </main>
          <StatusBar />
        </BootSequence>
      </body>
    </html>
  );
}
