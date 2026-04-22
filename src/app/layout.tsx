import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';
import { BootSequence } from '@/components/BootSequence';
import { TtyNav } from '@/components/TtyNav';
import { StatusBar } from '@/components/StatusBar';
import { profile } from '@content/profile';

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const plex = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://indulohithnarisetty.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — Detection Engineer`,
    template: `%s — ${profile.name}`,
  },
  description: profile.oneLine,
  applicationName: `${profile.handle}@${profile.host}`,
  authors: [{ name: profile.name, url: profile.linkedin }],
  keywords: [
    'Detection Engineering',
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
    title: `${profile.name} — Detection Engineer`,
    description: profile.oneLine,
    siteName: `${profile.handle}@${profile.host}`,
    url: SITE_URL,
    locale: 'en_US',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: `${profile.name} — Detection Engineer` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — Detection Engineer`,
    description: profile.oneLine,
    images: ['/og.svg'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#04050a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrains.variable} ${plex.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to third-party origins used on page load: visitor-counter worker + Cal.com embed.
            next/font/google already handles fonts.gstatic.com preconnect automatically. */}
        <link rel="preconnect" href="https://visitor-counter.indulohithnarisetty.workers.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://visitor-counter.indulohithnarisetty.workers.dev" />
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

        {/* Global CRT layers */}
        <div aria-hidden className="vignette-global" />
        <div aria-hidden className="scanline-global" />
        <div aria-hidden className="scanbar-global" />

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
