import { ButtonLink } from '@/components/ui/ButtonLink'
import { BUSINESS } from '@cabral-souza/shared'
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
  const foundedYear = BUSINESS.foundedYear
  const years = new Date().getFullYear() - foundedYear

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-[min(100vh,900px)] -mt-16">
      <div className="bg-ink-900 text-cream-300 flex flex-col justify-center px-6 py-16 pt-24 lg:py-24 lg:pt-28 lg:px-12 xl:px-16 order-2 lg:order-1">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-6">
          Galeria de Arte · Copacabana
        </p>

        <h1 className="font-display font-light text-title-xl text-cream-100 leading-[1.05] mb-6 max-w-[16ch]">
          Curadoria com <em className="text-bronze-500">rigor</em> desde {foundedYear}
        </h1>

        <p className="font-body text-lead text-cream-300/85 leading-relaxed mb-10 max-w-[48ch]">
          Arte moderna brasileira, escultura e antiguidades selecionadas — {years} anos de experiência
          no mercado carioca, com transparência documental e atendimento personalizado.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/acervo" variant="primary" size="lg">
            Ver acervo
          </ButtonLink>
          <ButtonLink href="/contato" variant="ghost" size="lg">
            Consultar peça
          </ButtonLink>
        </div>
      </div>

      <div className="bg-cream-100 flex items-center justify-center px-6 py-12 pt-24 lg:px-10 lg:py-16 lg:pt-28 order-1 lg:order-2 lg:border-l lg:border-bronze-500/15">
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
          <div className="w-full max-w-md aspect-[4/5] border-2 border-bronze-500 bg-cream-200 flex items-center justify-center">
            <p className="font-body text-eyebrow uppercase tracking-caps text-ink-700">Obra em destaque</p>
          </div>
        )}
      </div>
    </section>
  )
}
