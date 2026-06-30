import Link from 'next/link'
import { cn } from '@cabral-souza/ui'

/** Tom do logo conforme superfície de fundo */
export type LogoTone = 'on-cream' | 'on-dark'

export interface LogoProps {
  /** on-cream = texto ink (fundo claro) · on-dark = texto cream (fundo escuro) */
  tone?: LogoTone
  className?: string
  href?: string
}

export function Logo({ tone = 'on-cream', className, href = '/' }: LogoProps) {
  const isDark = tone === 'on-dark'

  return (
    <Link
      href={href}
      aria-label="Cabral & Souza — página inicial"
      className={cn(
        'inline-flex flex-col leading-none group',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300 rounded-sm',
        className,
      )}
    >
      <span
        className={cn(
          'font-display font-medium text-body-lg tracking-tight transition-colors duration-base',
          isDark ? 'text-cream-300 group-hover:text-bronze-300' : 'text-ink-900 group-hover:text-bronze-500',
        )}
      >
        Cabral &amp; Souza
      </span>
      <span
        className={cn(
          'mt-1 h-px w-3 transition-colors duration-base',
          isDark ? 'bg-bronze-300' : 'bg-bronze-500',
        )}
        aria-hidden
      />
      <span className="mt-1.5 font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500">
        Galeria de Arte
      </span>
    </Link>
  )
}
