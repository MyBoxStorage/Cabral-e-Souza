const MILESTONES = [
  { year: '1987', label: 'Fundação em Copacabana' },
  { year: '1995', label: 'Expansão Belle Époque' },
  { year: '2005', label: 'Escultura e tridimensional' },
  { year: '2015', label: 'Arte sacra e religiosa' },
  { year: '2026', label: 'Plataforma digital e curadoria ampliada' },
] as const

export function SobreTimeline() {
  return (
    <section aria-labelledby="timeline-heading" className="section-padding bg-ink-900 text-cream-300 overflow-hidden">
      <div className="container-default">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Trajetória
        </p>
        <h2 id="timeline-heading" className="font-display font-normal text-title-sm text-cream-100 mb-12">
          Quase quatro décadas de história
        </h2>

        <div className="relative">
          <div className="hidden lg:block absolute top-[18px] left-0 right-0 h-px bg-bronze-500/30" aria-hidden />

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 list-none">
            {MILESTONES.map((item) => (
              <li key={item.year} className="relative lg:text-center">
                <div className="flex lg:flex-col lg:items-center gap-4 lg:gap-3">
                  <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-bronze-500 bg-ink-900 font-body text-eyebrow text-bronze-500 lg:mx-auto">
                    ·
                  </span>
                  <div>
                    <p className="font-display text-title-xs text-bronze-300">{item.year}</p>
                    <p className="font-body text-body-sm text-cream-300/75 mt-1 leading-snug">{item.label}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
