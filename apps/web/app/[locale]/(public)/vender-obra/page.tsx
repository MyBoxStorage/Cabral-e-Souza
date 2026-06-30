import type { Metadata } from 'next'
import { SourcingForm } from '../../../../components/content/SourcingForm'
import { JsonLd } from '../../../../components/seo/JsonLd'
import { buildPageMetadata } from '../../../../lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Avalie e venda sua obra de arte',
  description:
    'Solicite avaliação preliminar de obras de arte e antiguidades. Galeria carioca com 40 anos de experiência, processo documentado e resposta em até 5 dias úteis.',
  path: '/vender-obra',
})

const TRUST_ITEMS = [
  { value: '40 anos', label: 'de experiência no mercado' },
  { value: '5 dias', label: 'para análise preliminar' },
  { value: '100%', label: 'confidencialidade garantida' },
]

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

      <section className="bg-[--color-paper-muted] border-b border-[--color-paper-deep] py-12 md:py-20">
        <div className="container-default max-w-[72ch]">
          <p className="label-caps text-[--color-accent] mb-4">Sourcing reverso</p>
          <h1 className="font-display text-[2.25rem] md:text-[3.25rem] font-light tracking-[-0.02em] leading-[1.1] mb-6">
            Sua obra merece avaliação à altura de sua história
          </h1>
          <p className="font-body text-[15px] leading-[1.85] text-[--color-ink-muted]">
            Há quatro décadas, a Cabral &amp; Souza orienta famílias e herdeiros na venda de obras de arte com rigor
            documental, confidencialidade e transparência. Nosso processo combina pesquisa de mercado, verificação de
            autenticidade e proposta fundamentada — sem pressa comercial nem promessas vazias.
          </p>
        </div>
      </section>

      <section className="border-b border-[--color-paper-deep] bg-[--color-paper]">
        <div className="container-default py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label}>
                <p className="font-display text-[1.75rem] font-light text-[--color-ink]">{item.value}</p>
                <p className="font-body text-[12px] text-[--color-ink-subtle] mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-default max-w-[640px]">
          <div className="mb-10 border border-[--color-paper-deep] p-6">
            <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-4">
              Como funciona
            </h2>
            <ol className="font-body text-[13px] leading-[1.8] text-[--color-ink-muted] list-decimal pl-5 space-y-2">
              <li>Você envia fotos e informações básicas sobre a obra.</li>
              <li>Nossa equipe realiza análise preliminar em até 5 dias úteis.</li>
              <li>Se houver interesse, agendamos inspeção presencial ou por especialista.</li>
              <li>Apresentamos proposta de compra ou consignação, conforme o caso.</li>
            </ol>
          </div>

          <SourcingForm />
        </div>
      </section>
    </>
  )
}
