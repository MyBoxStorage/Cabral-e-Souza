import Link from 'next/link'

export function InstitutionalCta() {
  return (
    <section
      aria-labelledby="institutional-cta-heading"
      className="bg-[--color-paper-muted] border-t border-[--color-paper-deep] py-12 md:py-16"
    >
      <div className="container-default max-w-[56ch] mx-auto text-center">
        <h2
          id="institutional-cta-heading"
          className="font-display text-[1.5rem] md:text-[1.875rem] font-light text-[--color-ink] tracking-[-0.02em] mb-3"
        >
          Como podemos ajudar?
        </h2>
        <p className="font-body text-[14px] leading-[1.7] text-[--color-ink-muted] mb-8">
          Explore o acervo, fale com nossa equipe ou solicite avaliação de uma obra.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/acervo"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-6 py-3 transition-colors duration-200"
          >
            Explorar acervo
          </Link>
          <Link
            href="/contato"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-paper] px-6 py-3 transition-colors duration-200"
          >
            Falar com a galeria
          </Link>
          <Link
            href="/vender-obra"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] border-b border-[--color-accent] pb-[2px] hover:text-[--color-accent-deep] transition-colors"
          >
            Avaliar uma obra
          </Link>
        </div>
      </div>
    </section>
  )
}
