import type { Metadata } from 'next'
import { SourcingForm } from '../../../../components/content/SourcingForm'

export const metadata: Metadata = {
  title: 'Avalie e venda sua obra de arte | Cabral & Souza',
  description:
    'Solicite avaliação preliminar de obras de arte e antiguidades. Galeria carioca com 40 anos de experiência, processo documentado e resposta em até 5 dias úteis.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Avaliação e aquisição de obras de arte',
  provider: {
    '@type': 'ArtGallery',
    name: 'Cabral & Souza Galeria de Arte',
    url: process.env['NEXT_PUBLIC_SITE_URL'],
  },
  description:
    'Serviço de avaliação preliminar e aquisição de obras de arte moderna, contemporânea e antiguidades para famílias e herdeiros.',
  areaServed: { '@type': 'Country', name: 'Brasil' },
}

export default function VenderObraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-[--color-paper-muted] border-b border-[--color-paper-deep] py-12 md:py-20">
        <div className="container-default max-w-[72ch]">
          <p className="label-caps mb-4">Sourcing reverso</p>
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
