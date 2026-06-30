import { Button } from '@cabral-souza/ui'
import { BUSINESS } from '@cabral-souza/shared'
import Link from 'next/link'

const TRUST_BADGES = [
  `${new Date().getFullYear() - BUSINESS.foundedYear} anos`,
  '5 dias resposta',
  '100% confidencialidade',
] as const

export function VenderObraCta() {
  return (
    <section
      aria-labelledby="vender-obra-cta-heading"
      className="section-padding bg-ink-900 text-cream-300"
    >
      <div className="container-default max-w-3xl mx-auto text-center">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-6">
          Consignação e Avaliação
        </p>
        <h2
          id="vender-obra-cta-heading"
          className="font-display font-normal text-title-md text-cream-300 mb-6"
        >
          Possui uma obra que merece avaliação cuidadosa?
        </h2>
        <p className="font-body text-lead text-cream-300/80 mb-10 max-w-[50ch] mx-auto leading-relaxed">
          Avaliamos obras de arte e antiguidades com rigor documental, confidencialidade absoluta e
          resposta em até 5 dias úteis.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-10 list-none">
          {TRUST_BADGES.map((badge) => (
            <li
              key={badge}
              className="font-body font-medium uppercase tracking-caps text-eyebrow text-cream-300/70"
            >
              {badge}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/vender-obra">Solicitar avaliação</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/contato">Falar com a galeria</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
