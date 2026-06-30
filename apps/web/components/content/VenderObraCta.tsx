import Link from 'next/link'

const TRUST_SIGNALS = [
  { value: '40', label: 'Anos de atuação' },
  { value: '5 dias', label: 'Resposta garantida' },
  { value: '100%', label: 'Confidencialidade' },
] as const

export function VenderObraCta() {
  return (
    <section
      aria-labelledby="vender-obra-cta-heading"
      className="border-t border-[--color-paper-deep] py-16 md:py-24 bg-[#E8E0D4]"
    >
      <div className="container-default max-w-[52rem] mx-auto text-center">
        <p className="label-caps text-[--color-accent] mb-4">Consignação e avaliação</p>
        <h2
          id="vender-obra-cta-heading"
          className="font-display text-[1.75rem] md:text-[2.5rem] font-light text-[--color-ink] tracking-[-0.02em] mb-4"
        >
          Possui uma obra que merece avaliação cuidadosa?
        </h2>
        <p className="font-body text-[14px] md:text-[15px] leading-[1.75] text-[--color-ink-muted] mb-10 max-w-[44ch] mx-auto">
          Avaliamos obras de arte e antiguidades com rigor documental, confidencialidade absoluta e
          resposta em até 5 dias úteis.
        </p>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-[36rem] mx-auto">
          {TRUST_SIGNALS.map((signal) => (
            <div
              key={signal.label}
              className="flex flex-col items-center py-4 px-3 border border-[--color-paper-deep]/60 bg-[--color-paper]/50"
            >
              <dt className="font-display text-[1.5rem] md:text-[1.75rem] font-light text-[--color-ink] leading-none mb-2">
                {signal.value}
              </dt>
              <dd className="font-body text-[10px] uppercase tracking-[0.12em] text-[--color-ink-subtle]">
                {signal.label}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/vender-obra"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-10 py-4 transition-colors duration-200"
          >
            Solicitar avaliação
          </Link>
          <Link
            href="/contato"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink]/30 hover:border-[--color-ink] px-8 py-4 transition-colors duration-200"
          >
            Falar com a galeria
          </Link>
        </div>
      </div>
    </section>
  )
}
