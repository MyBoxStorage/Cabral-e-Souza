import { ButtonLink } from '@/components/ui/ButtonLink'

export function HomeAboutSection() {
  return (
    <section
      aria-labelledby="home-about-heading"
      className="section-default bg-cream-100"
    >
      <div className="container-default grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative aspect-[4/3] overflow-hidden border-2 border-bronze-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3d3429] via-[#6f4f2c]/90 to-[#9a6f3f]/70" />
          <div
            className="absolute inset-0 opacity-30 mix-blend-multiply"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 30% 20%, rgba(196,168,120,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(26,22,18,0.5) 0%, transparent 60%)',
            }}
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-300 mb-3">
              A Galeria
            </p>
            <p className="font-display font-medium text-title-sm text-cream-100 leading-snug">
              Copacabana · Rio de Janeiro
            </p>
            <p className="mt-4 font-body text-caption text-cream-300/70 max-w-[28ch] leading-relaxed">
              Espaço físico em curadoria — imagem do interior em breve
            </p>
          </div>
        </div>

        <div>
          <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-3">
            Sobre a Galeria
          </p>
          <h2
            id="home-about-heading"
            className="font-display font-medium text-title-md text-ink-800 mb-6 leading-tight"
          >
            Quatro décadas de curadoria no Rio
          </h2>
          <p className="font-body text-body-lg text-ink-700 mb-5 leading-relaxed">
            Fundada em 1987 em Copacabana, a Cabral &amp; Souza dedica-se à arte moderna brasileira,
            escultura e antiguidades selecionadas com rigor documental e transparência comercial.
          </p>
          <p className="font-body text-body-lg text-ink-700 mb-8 leading-relaxed">
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
