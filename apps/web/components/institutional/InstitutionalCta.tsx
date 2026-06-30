import { Button } from '@cabral-souza/ui'
import Link from 'next/link'

export function InstitutionalCta() {
  return (
    <section
      aria-labelledby="institutional-cta-heading"
      className="section-padding bg-cream-100 border-t border-cream-200"
    >
      <div className="container-default max-w-narrow mx-auto text-center">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Cabral &amp; Souza
        </p>
        <h2
          id="institutional-cta-heading"
          className="font-display font-normal text-title-sm text-ink-800 mb-4"
        >
          Como podemos ajudar?
        </h2>
        <p className="font-body text-body text-ink-700 mb-10 max-w-[48ch] mx-auto leading-relaxed">
          Explore o acervo, fale com nossa equipe ou solicite avaliação de uma obra.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="primary">
            <Link href="/acervo">Explorar acervo</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contato">Falar com a galeria</Link>
          </Button>
          <Button asChild variant="tertiary" showChevron>
            <Link href="/vender-obra">Avaliar uma obra</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
