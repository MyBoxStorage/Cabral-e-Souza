import { Button } from '@cabral-souza/ui'
import { BUSINESS } from '@cabral-souza/shared'
import Link from 'next/link'
import { HeroArtworkPanel } from './HeroArtworkPanel'

interface HomeHeroProps {
  imageUrl?: string | null
  imageAlt: string
  artworkTitle: string
  artworkTechnical: string
  priceLabel: string
}

export function HomeHero({
  imageUrl,
  imageAlt,
  artworkTitle,
  artworkTechnical,
  priceLabel,
}: HomeHeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-0 lg:min-h-[90vh] overflow-hidden -mt-16 md:-mt-[72px]"
    >
      {/* Coluna esquerda — 60% dark */}
      <div className="relative flex flex-col justify-center bg-ink-900 text-cream-300 px-6 pt-28 pb-16 sm:px-10 lg:px-16 lg:pt-32 lg:pb-24 order-2 lg:order-1 min-h-[60vh] lg:min-h-[90vh]">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-8">
          Galeria de Arte · Rio de Janeiro · Desde {BUSINESS.foundedYear}
        </p>

        <h1
          id="hero-heading"
          className="font-display font-normal text-title-xl text-cream-300 max-w-[14ch] mb-8"
        >
          Arte brasileira
          <br />
          com <em className="font-display italic text-bronze-300">rigor</em> curatorial
        </h1>

        <p className="font-body text-body-lg text-cream-300/85 max-w-[50ch] mb-10 leading-relaxed">
          Quadros a óleo de mestres brasileiros e europeus, esculturas em bronze e peças raras
          selecionadas com critério histórico.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/acervo">Ver acervo</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/contato">Consultar peça</Link>
          </Button>
        </div>

        <p
          aria-hidden
          className="mt-auto pt-12 lg:absolute lg:bottom-8 lg:left-16 font-body font-medium uppercase tracking-eyebrow text-eyebrow text-cream-300/50"
        >
          Est. {BUSINESS.foundedYear}
        </p>
      </div>

      {/* Coluna direita — 40% creme + obra */}
      {imageUrl ? (
        <HeroArtworkPanel
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          eyebrow="Destaque do acervo"
          title={artworkTitle}
          technical={artworkTechnical}
          priceLabel={priceLabel}
        />
      ) : (
        <div className="bg-cream-100 order-1 lg:order-2 min-h-[40vh] lg:min-h-[90vh] flex items-center justify-center">
          <p className="font-body text-caption text-ink-700">Acervo em curadoria</p>
        </div>
      )}
    </section>
  )
}
