const CASES = [
  {
    eyebrow: 'Família do Rio',
    title: 'Volpi, têmpera sobre tela, 1965',
    excerpt:
      'Herdeiros enviaram documentação parcial e fotografias detalhadas. Análise confirmou autenticidade e condição compatível com mercado secundário.',
    result: 'Concluído em 4 dias úteis',
  },
  {
    eyebrow: 'Herdeiros de SP',
    title: 'Acervo modernista familiar',
    excerpt:
      'Conjunto de obras avaliado em lote, com priorização de peças de maior liquidez e proposta de consignação para o restante.',
    result: 'Concluído em 5 dias úteis',
  },
  {
    eyebrow: 'Colecionador europeu',
    title: 'Pedro Américo, óleo sobre tela',
    excerpt:
      'Obra em coleção no exterior retornou ao mercado brasileiro com documentação de exportação e laudo preliminar de autoria.',
    result: 'Concluído em 6 dias úteis',
  },
] as const

export function SourcingCaseCards() {
  return (
    <section aria-labelledby="casos-heading" className="section-padding bg-cream-50">
      <div className="container-default">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Casos
        </p>
        <h2 id="casos-heading" className="font-display font-normal text-title-sm text-ink-800 mb-12">
          Avaliações recentes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CASES.map((item) => (
            <article
              key={item.title}
              className="border border-cream-200 bg-cream-100 p-8 flex flex-col h-full"
            >
              <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-3">
                {item.eyebrow}
              </p>
              <h3 className="font-display font-medium text-title-xs text-ink-800 mb-4">{item.title}</h3>
              <p className="font-body text-body-sm text-ink-700 leading-relaxed flex-1 mb-6">{item.excerpt}</p>
              <p className="font-body text-eyebrow uppercase tracking-caps text-bronze-500">{item.result}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
