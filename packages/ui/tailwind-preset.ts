import type { Config } from 'tailwindcss'

/**
 * Preset Tailwind compartilhado — Cabral & Souza v3 design system.
 * Tokens CSS em packages/ui/tokens/ são a fonte de verdade;
 * este preset espelha para apps que usam config JS.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--color-ink-900)',
          900: 'var(--color-ink-900)',
          800: 'var(--color-ink-800)',
          700: 'var(--color-ink-700)',
          muted: 'var(--color-ink-muted)',
          subtle: 'var(--color-ink-subtle)',
        },
        cream: {
          50: 'var(--color-cream-50)',
          100: 'var(--color-cream-100)',
          200: 'var(--color-cream-200)',
          300: 'var(--color-cream-300)',
        },
        bronze: {
          300: 'var(--color-bronze-300)',
          500: 'var(--color-bronze-500)',
          700: 'var(--color-bronze-700)',
        },
        paper: {
          DEFAULT: 'var(--color-paper)',
          muted: 'var(--color-paper-muted)',
          deep: 'var(--color-paper-deep)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          deep: 'var(--color-accent-deep)',
          pale: 'var(--color-accent-pale)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        whatsapp: 'var(--color-whatsapp)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        eyebrow: ['var(--text-eyebrow)', { lineHeight: '1.4', letterSpacing: 'var(--tracking-eyebrow)' }],
        caption: ['var(--text-caption)', { lineHeight: '1.5', letterSpacing: 'var(--tracking-wide)' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: '1.6' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: '1.65' }],
        lead: ['var(--text-lead)', { lineHeight: '1.6' }],
        'title-xs': ['var(--text-title-xs)', { lineHeight: '1.2' }],
        'title-sm': ['var(--text-title-sm)', { lineHeight: '1.15' }],
        'title-md': ['var(--text-title-md)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'title-lg': ['var(--text-title-lg)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'title-xl': ['var(--text-title-xl)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        display: ['var(--text-display)', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-body)' }],
        lg: ['var(--text-lg)', { lineHeight: '1.65' }],
        xl: ['var(--text-xl)', { lineHeight: '1.6' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '1.2' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '1.15' }],
        '4xl': ['var(--text-4xl)', { lineHeight: '1.1' }],
        '5xl': ['var(--text-5xl)', { lineHeight: '1.05' }],
        '6xl': ['var(--text-6xl)', { lineHeight: '0.95' }],
      },
      letterSpacing: {
        tight: 'var(--tracking-tight)',
        normal: 'var(--tracking-normal)',
        wide: 'var(--tracking-wide)',
        wider: 'var(--tracking-wider)',
        caps: 'var(--tracking-caps)',
        eyebrow: 'var(--tracking-eyebrow)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
        40: 'var(--space-40)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'glow-bronze': 'var(--shadow-glow-bronze)',
      },
      transitionTimingFunction: {
        smooth: 'var(--ease-smooth)',
        editorial: 'var(--ease-editorial)',
        luxury: 'var(--ease-luxury)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        cinematic: 'var(--duration-cinematic)',
      },
      maxWidth: {
        narrow: 'var(--container-narrow)',
        default: 'var(--container-default)',
        wide: 'var(--container-wide)',
        full: 'var(--container-full)',
      },
    },
  },
}

export default preset
