import Link from 'next/link'

const PILLARS = [
  {
    number: '01',
    title: 'Filosofia de curadoria',
    excerpt:
      'A obra deve falar por si. Priorizamos autenticidade, condição técnica e relevância histórica — nunca decoração nem modismos passageiros.',
    href: '#filosofia',
  },
  {
    number: '02',
    title: 'Os sócios',
    excerpt:
      'Marcelo Cabral e Alexandre Teixeira de Souza conduzem a galeria desde a fundação, unindo leitura de mercado e rigor estético.',
    href: '#diretores',
  },
  {
    number: '03',
    title: 'Compromisso com o colecionador',
    excerpt:
      'Transparência sobre proveniência, autenticidade e condição. Cada transação é conduzida com acompanhamento personalizado.',
    href: '#compromisso',
  },
  {
    number: '04',
    title: 'Acervo selecionado',
    excerpt:
      'Modernismo brasileiro, Belle Époque, escultura e antiguidades curadas com critério — obras que dialogam com a história da arte nacional.',
    href: '/acervo',
  },
] as const

export function SobrePillarCards() {
  return (
    <section aria-labelledby="pilares-heading" className="section-padding bg-cream-50">
      <div className="container-default">
        <h2 id="pilares-heading" className="sr-only">
          Pilares da galeria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.number}
              className="group border border-cream-200 bg-cream-100 p-8 lg:p-10 hover:border-bronze-500/40 transition-colors duration-base"
            >
              <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
                {pillar.number}
              </p>
              <h3 className="font-display font-medium text-title-xs text-ink-800 mb-4">{pillar.title}</h3>
              <p className="font-body text-body text-ink-700 leading-relaxed mb-6">{pillar.excerpt}</p>
              <Link
                href={pillar.href}
                className="font-body text-body-sm font-medium text-bronze-500 hover:underline hover:underline-offset-4"
              >
                Saiba mais →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
