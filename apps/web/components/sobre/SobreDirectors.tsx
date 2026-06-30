// TODO: substituir por fotos reais dos sócios quando disponíveis

const DIRECTORS = [
  {
    name: 'Marcelo Cabral',
    role: 'Diretor de Mercado',
    bio: 'Quatro décadas de experiência no mercado carioca. Conduz relações com colecionadores, vendedores e instituições, com leitura precisa sobre autenticidade e precificação.',
    initial: 'M',
  },
  {
    name: 'Alexandre Teixeira de Souza',
    role: 'Diretor Curatorial',
    bio: 'Olhar técnico sobre conservação, documentação e avaliação estética. Garante que cada peça do acervo atenda a padrões exigentes de condição e coerência curatorial.',
    initial: 'A',
  },
] as const

export function SobreDirectors() {
  return (
    <section id="diretores" aria-labelledby="diretores-heading" className="section-padding bg-cream-100">
      <div className="container-default">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Os Diretores
        </p>
        <h2 id="diretores-heading" className="font-display font-normal text-title-md text-ink-800 mb-12 max-w-[24ch]">
          Marcelo Cabral &amp; Alexandre Teixeira de Souza
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {DIRECTORS.map((director) => (
            <article key={director.name} className="flex flex-col sm:flex-row gap-6 lg:gap-8">
              <div className="relative shrink-0 w-full sm:w-[200px] aspect-[3/4] border-2 border-bronze-500 bg-gradient-to-br from-cream-200 via-cream-100 to-bronze-300/30 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-title-lg text-ink-800/20 select-none">{director.initial}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 to-transparent" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-display font-medium text-title-xs text-ink-800 mb-1">{director.name}</h3>
                <p className="font-display italic text-body-lg text-bronze-500 mb-4">{director.role}</p>
                <p className="font-body text-body text-ink-700 leading-relaxed">{director.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
