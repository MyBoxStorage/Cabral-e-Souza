import type { Metadata } from 'next'
import { Button } from '@cabral-souza/ui'
import Link from 'next/link'
import { SourcingForm } from '../../../../components/content/SourcingForm'
import { JsonLd } from '../../../../components/seo/JsonLd'
import { SourcingCaseCards } from '../../../../components/vender-obra/SourcingCaseCards'
import { SourcingFaq } from '../../../../components/vender-obra/SourcingFaq'
import { SourcingProcessSteps } from '../../../../components/vender-obra/SourcingProcessSteps'
import { buildPageMetadata } from '../../../../lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Avalie e venda sua obra de arte',
  description:
    'Solicite avaliação preliminar de obras de arte e antiguidades. Galeria carioca com 40 anos de experiência, processo documentado e resposta em até 5 dias úteis.',
  path: '/vender-obra',
})

const GUARANTEES = [
  'Resposta em 5 dias úteis',
  'Confidencialidade absoluta',
  'Avaliação sem custo',
] as const

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Avaliação e aquisição de obras de arte',
  provider: { '@id': `${process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://cabralesouza.com.br'}/#organization` },
  description:
    'Serviço de avaliação preliminar e aquisição de obras de arte moderna, contemporânea e antiguidades para famílias e herdeiros.',
  areaServed: { '@type': 'Country', name: 'Brasil' },
}

export default function VenderObraPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* Hero split 55/45 — form na primeira fold */}
      <section className="grid grid-cols-1 lg:grid-cols-[11fr_9fr] min-h-[min(100vh,900px)] -mt-16 pt-16">
        <div className="bg-ink-900 text-cream-300 flex flex-col justify-center px-6 py-16 lg:py-24 lg:px-12 xl:px-16">
          <div className="max-w-[52ch]">
            <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-6">
              Avaliação e Consignação
            </p>
            <h1 className="font-display font-normal text-title-xl text-cream-100 leading-[1.08] mb-6">
              Sua obra merece
              <br />
              avaliação à altura
              <br />
              <span className="italic text-bronze-300">de sua história.</span>
            </h1>
            <p className="font-body text-lead text-cream-300/85 leading-relaxed mb-8">
              Quatro décadas orientando famílias e herdeiros na venda de obras de arte com rigor documental,
              confidencialidade absoluta e proposta fundamentada.
            </p>

            <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 mb-10 list-none">
              {GUARANTEES.map((item) => (
                <li key={item} className="font-body text-body-sm text-cream-300/90 flex items-center gap-2">
                  <span className="text-bronze-500" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="font-body text-caption text-cream-300/50">
              Mais de R$ 50 milhões em obras avaliadas desde 1987
            </p>
          </div>
        </div>

        <div className="bg-cream-100 flex flex-col justify-center px-6 py-12 lg:py-16 lg:px-10 xl:px-14 border-t lg:border-t-0 lg:border-l border-cream-200">
          <SourcingForm id="sourcing-form-hero" />
        </div>
      </section>

      <SourcingProcessSteps />
      <SourcingCaseCards />
      <SourcingFaq />

      <section className="section-padding bg-ink-900 text-cream-300">
        <div className="container-default max-w-narrow mx-auto text-center">
          <h2 className="font-display font-normal text-title-sm text-cream-100 mb-4">Pronto para começar?</h2>
          <p className="font-body text-body text-cream-300/80 mb-8">
            Envie fotografias e informações básicas. Nossa equipe retorna em até 5 dias úteis.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="#sourcing-form-hero">Solicitar avaliação</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
