import type { Config } from 'tailwindcss';

/**
 * DECLASSIFIED DOSSIER THEME
 * ──────────────────────────
 * The site reads as a declassified intelligence case file: manila paper,
 * typewriter ink, archival stamp blue, classification red.
 *
 * Token contract (kept from the CRT era so pages restyle themselves):
 *   slate-*  → typewriter ink text scale (100 darkest … 700 faintest)
 *   ink-*    → paper surface scale (950 brightest sheet … 600 kraft)
 *   phos     → archival stamp blue (was phosphor cyan)
 *   magenta  → classification stamp red
 *   amber    → ochre / aged-ink accent
 *   sev-*    → severity inks tuned for light paper
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './content/**/*.{ts,tsx,md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paper surfaces — inverted from the old dark ink scale.
        ink: {
          950: '#f7f1e0', // brightest sheet
          900: '#f1e9d3', // standard sheet
          800: '#e9dec2', // folder tab
          700: '#decfab', // kraft light
          600: '#c8b68c', // kraft border / "familiar" cells
        },
        // Typewriter ink — replaces Tailwind's slate so existing
        // text-slate-* utilities become ink-on-paper.
        slate: {
          50: '#14100a',
          100: '#1b1610',
          200: '#262017',
          300: '#3a3224',
          400: '#554a36',
          500: '#6f6249',
          600: '#837358',
          700: '#a99873',
          800: '#c2b28c',
          900: '#d9cba6',
          950: '#e7dcc0',
        },
        // Archival stamp blue (ballpoint / RECEIVED-stamp ink).
        phos: {
          DEFAULT: '#29538f',
          50: '#eff3fa',
          100: '#dbe5f2',
          200: '#b7cbe4',
          300: '#8aa9cf',
          400: '#5f83b3',
          500: '#3f689f',
          600: '#29538f',
          700: '#224473',
          800: '#1c3759',
          900: '#162a43',
        },
        // Classification stamp red.
        magenta: {
          DEFAULT: '#a4232b',
          50: '#fbeeed',
          100: '#f4d6d4',
          200: '#e7aba6',
          300: '#d47c76',
          400: '#bc4a48',
          500: '#a4232b',
          600: '#8c1a24',
          700: '#70141d',
          800: '#521016',
        },
        // Ochre / aged manila ink.
        amber: {
          DEFAULT: '#a5761b',
          300: '#7c540a',
          400: '#8d6110',
          500: '#6b4707',
        },
        sev: {
          crit: '#9c1a26',
          high: '#a34a0c',
          med: '#856a00',
          low: '#29538f',
          info: '#6f6249',
        },
        grid: 'rgba(41, 83, 143, 0.12)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'Courier Prime', 'Courier New', 'monospace'],
        display: ['var(--font-display)', 'Stardos Stencil', 'Courier Prime', 'monospace'],
        sans: ['var(--font-sans)', 'Caveat', 'cursive'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.1rem', letterSpacing: '0.02em' }],
        // Lighthouse font-size audit requires >= 12px; keep tight line-height +
        // wider tracking so the evidence-tag feel is preserved.
        'tiny': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        // Paper lift — deep stack for modals, shallow for cells.
        phos: '0 1px 0 rgba(38, 32, 23, 0.06), 0 18px 40px -14px rgba(66, 52, 28, 0.5)',
        'phos-sm': '0 1px 0 rgba(38, 32, 23, 0.06), 0 6px 16px -8px rgba(66, 52, 28, 0.35)',
        magenta: '0 6px 18px -6px rgba(164, 35, 43, 0.35)',
        inset: 'inset 0 0 44px rgba(120, 96, 56, 0.08)',
      },
      backgroundImage: {
        // Faint ledger ruling (was CRT scanlines).
        scanlines:
          'repeating-linear-gradient(0deg, rgba(41,83,143,0.05) 0px, rgba(41,83,143,0.05) 1px, transparent 1px, transparent 28px)',
        grid:
          'linear-gradient(rgba(41, 83, 143, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(41, 83, 143, 0.08) 1px, transparent 1px)',
        vignette:
          'radial-gradient(ellipse at center, transparent 40%, rgba(92, 70, 34, 0.25) 100%)',
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
        flicker: {
          '0%, 18%, 22%, 25%, 53%, 57%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.92' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(164, 35, 43, 0.35)' },
          '50%': { boxShadow: '0 0 0 6px rgba(164, 35, 43, 0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stampIn: {
          '0%': { opacity: '0', transform: 'scale(1.9) rotate(-14deg)' },
          '60%': { opacity: '1', transform: 'scale(0.94) rotate(-5deg)' },
          '100%': { opacity: '0.85', transform: 'scale(1) rotate(-6deg)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        flicker: 'flicker 6s infinite',
        scan: 'scan 8s linear infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        slideUp: 'slideUp 280ms ease-out both',
        stampIn: 'stampIn 420ms cubic-bezier(0.2, 1.4, 0.4, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
