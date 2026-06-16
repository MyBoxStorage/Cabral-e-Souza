import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cabral & Souza — Galeria de Arte e Antiguidades',
  description:
    'Galeria especializada em quadros a óleo, esculturas em bronze e arte clássica brasileira. Rio de Janeiro, desde 1987.',
}

export default function HomePage() {
  const t = useTranslations()

  return (
    <main>
      {/* Hero — placeholder para Etapa 2 (layout completo) */}
      <section
        aria-label={t('hero.eyebrow')}
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-16) var(--space-6)',
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-caps)',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-6)',
          }}
        >
          {t('hero.eyebrow')}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, var(--text-6xl))',
            fontWeight: 400,
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: 'var(--space-8)',
            maxWidth: '14ch',
          }}
        >
          {t('hero.title')}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-lg)',
            color: 'rgba(250,250,247,0.65)',
            maxWidth: '44ch',
            lineHeight: 'var(--leading-loose)',
            marginBottom: 'var(--space-10)',
          }}
        >
          {t('hero.description')}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="#colecao"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-paper)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-caps)',
              textTransform: 'uppercase',
              padding: 'var(--space-4) var(--space-8)',
              transition: `background var(--duration-normal) var(--ease-luxury)`,
            }}
          >
            {t('hero.cta_primary')}
          </a>
          <a
            href="#contato"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-caps)',
              textTransform: 'uppercase',
              color: 'var(--color-accent-pale)',
              borderBottom: '1px solid var(--color-accent)',
              paddingBottom: '2px',
            }}
          >
            {t('hero.cta_ghost')}
          </a>
        </div>
        <p
          style={{
            position: 'absolute',
            bottom: 'var(--space-8)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-caps)',
            color: 'rgba(139,115,85,0.5)',
            textTransform: 'uppercase',
          }}
        >
          {t('hero.established')}
        </p>
      </section>
    </main>
  )
}
