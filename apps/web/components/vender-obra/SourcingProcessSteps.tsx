const STEPS = [
  {
    step: '01',
    title: 'Envio de informações',
    description: 'Você envia fotos e dados básicos sobre a obra. Resposta de recebimento em até 24 horas.',
  },
  {
    step: '02',
    title: 'Análise preliminar',
    description: 'Nossa equipe avalia autenticidade, condição e mercado. Prazo de até 5 dias úteis.',
  },
  {
    step: '03',
    title: 'Inspeção especializada',
    description: 'Se houver interesse, agendamos visita presencial ou avaliação por especialista.',
  },
  {
    step: '04',
    title: 'Proposta fundamentada',
    description: 'Apresentamos compra direta ou consignação, com critérios transparentes.',
  },
] as const

export function SourcingProcessSteps() {
  return (
    <section aria-labelledby="processo-heading" className="section-padding bg-cream-100">
      <div className="container-default">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Processo
        </p>
        <h2 id="processo-heading" className="font-display font-normal text-title-sm text-ink-800 mb-12">
          Como funciona
        </h2>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 list-none">
          {STEPS.map((item) => (
            <li key={item.step}>
              <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-3">
                {item.step}
              </p>
              <h3 className="font-display font-medium text-title-xs text-ink-800 mb-3">{item.title}</h3>
              <p className="font-body text-body-sm text-ink-700 leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
