import { ButtonLink } from '@/components/ui/ButtonLink'

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-ink-900 text-cream-300 -mt-16 pt-16"
    >
      <p className="font-display font-light text-display text-bronze-500 leading-none mb-8" aria-hidden>
        404
      </p>
      <h1
        id="not-found-heading"
        className="font-display font-normal text-title-md text-cream-100 max-w-[20ch] leading-tight mb-6"
      >
        A obra que você procura não foi encontrada
      </h1>
      <p className="font-body text-lead text-bronze-300/90 max-w-[44ch] mb-12 leading-relaxed">
        Talvez tenha sido reservada, vendida ou esteja em outra sala da galeria.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ButtonLink href="/acervo" variant="primary" size="lg">
          Ver acervo
        </ButtonLink>
        <ButtonLink href="/boletim" variant="ghost" size="lg">
          Boletim
        </ButtonLink>
        <ButtonLink href="/contato" variant="secondary" size="lg">
          Falar com a galeria
        </ButtonLink>
      </div>
    </section>
  )
}
