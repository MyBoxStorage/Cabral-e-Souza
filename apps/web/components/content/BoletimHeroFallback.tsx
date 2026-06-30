const CATEGORY_LABELS: Record<string, string> = {
  analise_leilao: 'Análise de Leilão',
  verbete_artista: 'Verbete',
  mercado: 'Mercado',
  editorial: 'Editorial',
  noticia: 'Notícia',
}

interface BoletimHeroFallbackProps {
  title: string
  category: string
  fullBleed?: boolean
}

export function BoletimHeroFallback({ title, category, fullBleed = false }: BoletimHeroFallbackProps) {
  const label = CATEGORY_LABELS[category] ?? category

  return (
    <div
      className={[
        'relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-200 to-bronze-300/30',
        fullBleed ? 'h-full w-full' : 'aspect-[16/9]',
      ].join(' ')}
      aria-hidden
    >
      <div className="absolute top-4 right-4 font-display text-title-xs text-bronze-500/30 select-none">
        C&amp;S
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 py-10 text-center">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-5">
          {label}
        </p>
        <p className="font-display font-medium text-title-sm text-ink-800/90 leading-snug line-clamp-4 max-w-[36ch]">
          {title}
        </p>
      </div>
    </div>
  )
}
