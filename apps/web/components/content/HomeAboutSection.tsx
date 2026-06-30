import { ButtonLink } from '@/components/ui/ButtonLink'

export function HomeAboutSection() {
  return (
    <section
      aria-labelledby="home-about-heading"
      className="section-padding bg-cream-100"
    >
      <div className="container-default grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative order-1 lg:order-1 aspect-[4/3] overflow-hidden border-2 border-bronze-500 bg-cream-200">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/80 via-ink-800/60 to-bronze-700/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-300 mb-3">
              A Galeria
            </p>
            <p className="font-display text-title-sm text-cream-300">Copacabana · Rio de Janeiro</p>
            <p className="mt-4 font-body text-caption text-cream-300/60 max-w-[28ch]">
              Espaço físico em curadoria — imagem do interior em breve
            </p>
          </div>
        </div>

        <div className="order-2 lg:order-2">
          <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
            Sobre a Galeria
          </p>
          <h2
            id="home-about-heading"
            className="font-display font-normal text-title-md text-ink-800 mb-6"
          >
            Quatro décadas de curadoria no Rio
          </h2>
          <p className="font-body text-body text-ink-700 mb-5 leading-relaxed">
            Fundada em 1987 em Copacabana, a Cabral &amp; Souza dedica-se à arte moderna brasileira,
            escultura e antiguidades selecionadas com rigor documental e transparência comercial.
          </p>
          <p className="font-body text-body text-ink-700 mb-8 leading-relaxed">
            Cada obra do acervo passa por verificação de autenticidade e proveniência antes de integrar
            o catálogo público — uma prática construída ao longo de quatro décadas no mercado carioca.
          </p>
          <ButtonLink href="/sobre" variant="tertiary" showChevron>
            Conheça nossa história
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
