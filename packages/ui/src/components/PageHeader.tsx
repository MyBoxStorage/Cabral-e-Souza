import { cn } from '../lib/cn'

export interface PageHeaderProps {
  section?: string
  title: string
  subtitle?: string
  dark?: boolean
  className?: string
}

export function PageHeader({ section, title, subtitle, dark = false, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'page-header',
        dark ? 'bg-ink-900' : 'bg-cream-100',
        'py-16 lg:py-20',
        className,
      )}
    >
      <div className="page-header__container container-default max-w-wide">
        {section && (
          <span className="page-header__eyebrow block font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
            {section}
          </span>
        )}
        <h1
          className={cn(
            'page-header__title font-display font-normal text-title-lg',
            dark ? 'text-cream-300' : 'text-ink-800',
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'page-header__subtitle mt-6 font-body text-lead max-w-[65ch]',
              dark ? 'text-cream-300/85' : 'text-ink-700',
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      <hr
        className={cn(
          'page-header__divider mt-16 lg:mt-20 border-0 border-t',
          dark ? 'border-ink-700' : 'border-cream-200',
        )}
      />
    </header>
  )
}
