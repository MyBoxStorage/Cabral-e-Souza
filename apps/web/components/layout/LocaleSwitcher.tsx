'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { routing } from '../../i18n/routing'

type Locale = (typeof routing.locales)[number]

export function LocaleSwitcher() {
  const t = useTranslations('locale')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      // Remove o prefixo do locale atual do pathname se existir
      const segments = pathname.split('/')
      const hasLocalePrefix = routing.locales.includes(segments[1] as Locale)
      const cleanPath = hasLocalePrefix ? '/' + segments.slice(2).join('/') : pathname
      const targetPath = next === routing.defaultLocale ? cleanPath || '/' : `/${next}${cleanPath}`
      router.replace(targetPath)
    })
  }

  return (
    <nav aria-label={t('change')} className="flex items-center gap-1">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && (
            <span className="text-[--color-border] mx-1 select-none text-xs" aria-hidden>
              /
            </span>
          )}
          <button
            onClick={() => switchLocale(loc)}
            disabled={isPending}
            aria-current={loc === locale ? 'true' : undefined}
            aria-label={`${t('change')}: ${loc}`}
            className={[
              'font-body text-[11px] tracking-[0.08em] uppercase transition-colors duration-200',
              'hover:text-[--color-accent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent] rounded-sm px-0.5',
              loc === locale
                ? 'text-[--color-accent] font-medium'
                : 'text-[--color-ink-subtle]',
              isPending ? 'opacity-50' : '',
            ].join(' ')}
          >
            {t(loc)}
          </button>
        </span>
      ))}
    </nav>
  )
}
