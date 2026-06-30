export function SobreManifestoHero() {
  return (
    <section
      aria-labelledby="sobre-manifesto-heading"
      className="relative min-h-[60vh] flex flex-col items-center justify-center bg-ink-900 text-cream-300 -mt-16 pt-16"
    >
      <div className="container-default max-w-narrow mx-auto text-center px-4 py-24 lg:py-32">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-8">
          Sobre a Galeria
        </p>
        <h1
          id="sobre-manifesto-heading"
          className="font-display font-normal text-display text-cream-100 leading-[1.1] tracking-tight"
        >
          Quatro décadas
          <br />
          de curadoria
          <br />
          <span className="text-bronze-300 italic">no Rio de Janeiro.</span>
        </h1>
        <p className="mt-8 font-body text-lead text-cream-300/75 max-w-[42ch] mx-auto leading-relaxed">
          Desde 1987 em Copacabana, a Cabral &amp; Souza orienta colecionadores com rigor documental,
          transparência e respeito à história de cada obra.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50" aria-hidden>
        <span className="font-body text-eyebrow uppercase tracking-caps text-cream-300/60">Explorar</span>
        <span className="block w-px h-8 bg-bronze-500/50 animate-pulse" />
      </div>
    </section>
  )
}
