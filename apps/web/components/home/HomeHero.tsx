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
    <section className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-[min(100vh,900px)] -mt-16 pt-16">
      <div className="bg-ink-900 text-cream-300 flex flex-col justify-center px-6 py-16 lg:py-24 lg:px-12 xl:px-16">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-6">
          Galeria de Arte · Copacabana
        </p>

        <h1 className="font-display font-normal text-title-xl text-cream-100 leading-[1.05] mb-6 max-w-[16ch]">
          Curadoria com <span className="italic text-bronze-300">rigor</span> desde {foundedYear}
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

      <div className="bg-cream-100 flex items-center justify-center p-6 lg:p-10 border-t lg:border-t-0 lg:border-l border-cream-200">
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
