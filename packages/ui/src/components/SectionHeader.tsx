import { cn } from '../lib/cn'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  link?: {
    href: string
    label: string
  }
  align?: 'left' | 'center'
  dark?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  link,
  align = 'left',
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'section-header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'text-center sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn(align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <span className="block font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-3">
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            'font-display font-medium text-title-md leading-tight',
            dark ? 'text-cream-300' : 'text-ink-800',
          )}
        >
          {title}
        </h2>
      </div>

      {link && (
        <a
          href={link.href}
          className="font-body text-body-sm font-medium text-bronze-500 hover:underline hover:underline-offset-4 shrink-0 sm:mb-1"
        >
          {link.label} →
        </a>
      )}
    </div>
  )
}
