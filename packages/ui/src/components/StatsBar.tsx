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
        'stats-bar py-20',
        dark ? 'bg-ink-900' : 'bg-cream-50',
        className,
      )}
    >
      <div className="container-default max-w-wide">
        <div
          className={cn(
            'grid gap-8',
            items.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {items.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                'stats-bar__item flex flex-col items-center text-center px-6',
                index > 0 && 'md:border-l md:border-bronze-500/25',
              )}
            >
              <span className="font-display font-normal text-title-xl text-bronze-500 leading-none">
                {item.value}
              </span>
              <span
                className={cn(
                  'mt-4 font-body font-medium uppercase tracking-eyebrow text-eyebrow',
                  dark ? 'text-cream-300' : 'text-ink-800',
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
