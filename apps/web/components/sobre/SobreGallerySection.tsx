import { BUSINESS } from '@cabral-souza/shared'

export function SobreGallerySection() {
  return (
    <section id="galeria" aria-labelledby="galeria-heading" className="section-padding bg-cream-50">
      <div className="container-default grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
            A Galeria
          </p>
          <h2 id="galeria-heading" className="font-display font-normal text-title-md text-ink-800 mb-6">
            Um espaço para contemplar arte com calma
          </h2>
          <p className="font-body text-body text-ink-700 leading-relaxed mb-6">
            Nossa sede em Copacabana foi pensada para receber colecionadores em ambiente reservado, adequado à
            contemplação de obras de valor significativo. Visitas são agendadas com antecedência para garantir
            atenção personalizada a cada encontro.
          </p>
          <div className="border-l-2 border-bronze-500 pl-6">
            <p className="font-display italic text-title-xs text-ink-800 mb-2">{BUSINESS.address.street}</p>
            <p className="font-body text-body-sm text-ink-700">
              {BUSINESS.address.neighborhood} · {BUSINESS.address.city}, {BUSINESS.address.state}
            </p>
            <p className="font-body text-body-sm text-bronze-500 mt-3">{BUSINESS.hours}</p>
            <p className="font-body text-caption text-ink-700 mt-1">{BUSINESS.hoursDetail}</p>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden border-2 border-bronze-500 bg-cream-200">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/85 via-ink-800/70 to-bronze-700/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-300 mb-3">
              Interior da galeria
            </p>
            <p className="font-display text-title-xs text-cream-300 max-w-[32ch]">
              Imagem do espaço físico em breve
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
