import Image from 'next/image'
import Link from 'next/link'

interface HomeAboutSectionProps {
  imageUrl?: string | null
  imageAlt?: string
}

export function HomeAboutSection({
  imageUrl,
  imageAlt = 'Obra de referência do acervo — arte brasileira em destaque na galeria',
}: HomeAboutSectionProps) {
  return (
    <section
      aria-labelledby="home-about-heading"
      className="bg-[--color-paper-muted] border-y border-[--color-paper-deep] py-16 md:py-24"
    >
      <div className="container-default grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <p className="label-caps text-[--color-accent] mb-4">Sobre a galeria</p>
          <h2
            id="home-about-heading"
            className="font-display text-[2rem] md:text-[2.5rem] font-light text-[--color-ink] tracking-[-0.02em] mb-6"
          >
            Quatro décadas de curadoria no Rio
          </h2>
          <p className="font-body text-[15px] leading-[1.85] text-[--color-ink-muted] mb-5">
            Fundada em 1987 em Copacabana, a Cabral &amp; Souza dedica-se à arte moderna e contemporânea
            brasileira com rigor documental, transparência comercial e orientação ao colecionador.
          </p>
          <p className="font-body text-[15px] leading-[1.85] text-[--color-ink-muted] mb-8">
            Cada obra do acervo passa por verificação de autenticidade e proveniência antes de integrar
            o catálogo público — uma prática construída ao longo de quarenta anos de atuação no mercado
            carioca.
          </p>
          <Link
            href="/sobre"
            className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] border-b border-[--color-accent] pb-[2px] hover:text-[--color-accent-deep] transition-colors"
          >
            Conheça nossa história
          </Link>
        </div>

        <div className="relative order-1 lg:order-2 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] max-h-[32rem] lg:max-h-none overflow-hidden border border-[--color-paper-deep] bg-[--color-paper]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[--color-paper] via-[--color-paper-muted] to-[--color-paper-deep]" />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[--color-ink]/30 via-transparent to-transparent"
            aria-hidden
          />
          <p className="absolute bottom-4 left-4 right-4 font-body text-[10px] uppercase tracking-[0.12em] text-[rgba(250,250,247,0.75)]">
            Acervo · Rio de Janeiro
          </p>
        </div>
      </div>
    </section>
  )
}
