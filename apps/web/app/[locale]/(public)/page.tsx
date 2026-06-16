import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cabral & Souza — Galeria de Arte e Antiguidades',
  description:
    'Galeria especializada em arte moderna e contemporânea brasileira. Obras de Di Cavalcanti, Alfredo Volpi, Djanira e outros mestres. Rio de Janeiro, desde 1987.',
}

export default function HomePage() {
  const t = useTranslations()

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative min-h-[calc(100dvh-72px)] flex flex-col items-center justify-center text-center bg-[--color-ink] text-[--color-paper] px-6 py-24"
      >
        <p className="label-caps text-[--color-accent] mb-8">
          {t('hero.eyebrow')}
        </p>

        <h1
          id="hero-heading"
          className="font-display text-[clamp(2.75rem,7vw,6rem)] font-light leading-[1.05] tracking-[-0.02em] max-w-[14ch] mb-8"
        >
          {t('hero.title')}
        </h1>

        <p className="font-body text-[--text-lg] leading-[1.8] text-[rgba(250,250,247,0.6)] max-w-[44ch] mb-12">
          {t('hero.description')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/acervo"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-8 py-4 transition-colors duration-200"
          >
            {t('hero.cta_primary')}
          </Link>
          <Link
            href="/contato"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] border-b border-[--color-accent] pb-[2px] hover:text-[--color-paper] hover:border-[--color-paper] transition-colors duration-200"
          >
            {t('hero.cta_ghost')}
          </Link>
        </div>

        <p
          aria-hidden
          className="absolute bottom-8 font-body text-[10px] uppercase tracking-[0.18em] text-[rgba(139,115,85,0.4)]"
        >
          {t('hero.established')}
        </p>
      </section>

      {/* Strip de credenciais */}
      <section
        aria-label="Diferenciais"
        className="bg-[--color-paper-muted] border-y border-[--color-paper-deep] py-10"
      >
        <div className="container-default">
          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[--color-paper-deep]">
            {[
              { value: t('stats.pieces'), label: t('stats.pieces_label') },
              { value: t('stats.years'), label: t('stats.years_label') },
              { value: t('stats.authenticity'), label: t('stats.authenticity_label') },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-6 px-8 text-center">
                <dt className="font-display text-[2.5rem] font-light text-[--color-ink] leading-none mb-2">
                  {stat.value}
                </dt>
                <dd className="font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
