import Link from 'next/link'

export function VenderObraCta() {
  return (
    <section
      aria-labelledby="vender-obra-cta-heading"
      className="border-t border-[--color-paper-deep] py-16 md:py-20 bg-[--color-paper]"
    >
      <div className="container-default text-center max-w-[56ch] mx-auto">
        <h2
          id="vender-obra-cta-heading"
          className="font-display text-[1.75rem] md:text-[2.25rem] font-light text-[--color-ink] tracking-[-0.02em] mb-4"
        >
          Possui uma obra que merece avaliação cuidadosa?
        </h2>
        <p className="font-body text-[14px] leading-[1.7] text-[--color-ink-muted] mb-8">
          Avaliamos obras de arte e antiguidades com rigor documental, confidencialidade e resposta em até 5 dias úteis.
        </p>
        <Link
          href="/vender-obra"
          className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-8 py-4 transition-colors duration-200"
        >
          Solicitar avaliação
        </Link>
      </div>
    </section>
  )
}
