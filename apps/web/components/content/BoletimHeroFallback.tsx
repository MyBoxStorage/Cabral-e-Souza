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
}

export function BoletimHeroFallback({ title, category }: BoletimHeroFallbackProps) {
  const label = CATEGORY_LABELS[category] ?? category

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden border-b border-[--color-paper-deep] bg-[--color-paper-muted]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[--color-paper] via-[--color-paper-muted] to-[--color-paper-deep]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(26,26,24,0.04) 39px, rgba(26,26,24,0.04) 40px)',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 py-10 text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.16em] text-[--color-accent] mb-5">
          {label}
        </p>
        <p className="font-display text-[clamp(1.05rem,2.8vw,1.4rem)] font-light text-[--color-ink]/85 leading-snug line-clamp-4 max-w-[36ch]">
          {title}
        </p>
      </div>
    </div>
  )
}
