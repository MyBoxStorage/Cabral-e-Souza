import { Fragment } from 'react'
import { cn } from '../lib/cn'

export interface StatItem {
  value: string
  label: string
}

export interface StatsBarProps {
  items: StatItem[]
  dark?: boolean
  className?: string
}

export function StatsBar({ items, dark = false, className }: StatsBarProps) {
  return (
    <div
      className={cn(
        'stats-bar py-16 md:py-20',
        dark ? 'bg-ink-900' : 'bg-cream-50',
        className,
      )}
    >
      <div className="container-default max-w-wide">
        <div className="flex flex-col md:flex-row md:items-stretch md:justify-center">
          {items.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 && (
                <div
                  className="hidden md:block w-px self-center shrink-0 bg-bronze-500/35"
                  style={{ height: '60%', minHeight: '3rem' }}
                  aria-hidden
                />
              )}
              <div className="stats-bar__item flex flex-1 flex-col items-center justify-center text-center px-6 py-4 md:py-0 md:px-10">
                <span className="font-display font-normal text-title-lg text-bronze-500 leading-none tracking-tight">
                  {item.value}
                </span>
                <span
                  className={cn(
                    'mt-3 font-body font-medium uppercase tracking-eyebrow text-eyebrow',
                    dark ? 'text-cream-300/80' : 'text-ink-700',
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
