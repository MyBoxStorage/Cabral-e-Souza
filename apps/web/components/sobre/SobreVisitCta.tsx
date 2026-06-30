import { Button } from '@cabral-souza/ui'
import { BUSINESS, whatsappUrl } from '@cabral-souza/shared'
import Link from 'next/link'

export function SobreVisitCta() {
  return (
    <section
      aria-labelledby="visita-heading"
      className="section-padding bg-cream-100 border-t border-cream-200"
    >
      <div className="container-default max-w-narrow mx-auto text-center">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Visite-nos
        </p>
        <h2 id="visita-heading" className="font-display font-normal text-title-sm text-ink-800 mb-4">
          Visite nossa galeria em Copacabana
        </h2>
        <p className="font-body text-body text-ink-700 mb-2">{BUSINESS.addressFormatted}</p>
        <p className="font-body text-body-sm text-bronze-500 mb-10">
          {BUSINESS.hours} · {BUSINESS.hoursDetail}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="primary">
            <Link href="/contato">Agendar visita</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href={whatsappUrl('Olá! Gostaria de agendar uma visita à galeria.')} target="_blank" rel="noopener noreferrer">
              Falar via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
