import type { Config } from 'tailwindcss';

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
        ink: {
          950: '#05060a',
          900: '#0a0b12',
          800: '#10121d',
          700: '#171927',
          600: '#1f2233',
        },
        phos: {
          DEFAULT: '#5ef2ff',
          50: '#eafcff',
          100: '#caf6fd',
          200: '#8eecfb',
          300: '#5ef2ff',
          400: '#2cd5e8',
          500: '#15b4c7',
          600: '#0e8b9b',
          700: '#0d6a76',
          800: '#0e4f59',
          900: '#0a3a42',
        },
        magenta: {
          DEFAULT: '#ff3db1',
          50: '#fff0fa',
          100: '#ffd7ef',
          200: '#ffb0e0',
          300: '#ff7fcb',
          400: '#ff3db1',
          500: '#e21a92',
          600: '#b80e77',
          700: '#8d0a5c',
          800: '#660a45',
        },
        amber: {
          DEFAULT: '#ffb94a',
          300: '#ffcb71',
          400: '#ffb94a',
          500: '#eb9a18',
        },
        sev: {
          crit: '#ff2e63',
          high: '#ff6b35',
          med: '#ffb94a',
          low: '#5ef2ff',
          info: '#94a3b8',
        },
        grid: 'rgba(94, 242, 255, 0.08)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        display: ['var(--font-display)', 'IBM Plex Mono', 'JetBrains Mono', 'monospace'],
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.1rem', letterSpacing: '0.02em' }],
        // Lighthouse font-size audit requires >= 12px; bump from 0.68rem to 0.75rem and keep
        // tight line-height + wider tracking so the terminal-chip feel is preserved.
        'tiny': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        phos: '0 0 24px rgba(94, 242, 255, 0.35)',
        'phos-sm': '0 0 10px rgba(94, 242, 255, 0.3)',
        magenta: '0 0 24px rgba(255, 61, 177, 0.35)',
        inset: 'inset 0 0 60px rgba(94, 242, 255, 0.06)',
      },
      backgroundImage: {
        scanlines:
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
        grid:
          'linear-gradient(rgba(94, 242, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94, 242, 255, 0.06) 1px, transparent 1px)',
        vignette:
          'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
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
          '0%, 100%': { boxShadow: '0 0 8px rgba(94, 242, 255, 0.35)' },
          '50%': { boxShadow: '0 0 22px rgba(94, 242, 255, 0.7)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        flicker: 'flicker 6s infinite',
        scan: 'scan 8s linear infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        slideUp: 'slideUp 280ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
