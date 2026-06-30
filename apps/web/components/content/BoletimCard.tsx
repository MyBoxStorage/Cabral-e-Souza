import Image from 'next/image'
import Link from 'next/link'
import type { BoletimPost } from '../../lib/queries/boletim'
import { BoletimHeroFallback } from './BoletimHeroFallback'

const CATEGORY_LABELS: Record<string, string> = {
  analise_leilao: 'Análise de Leilão',
  verbete_artista: 'Verbete',
  mercado: 'Mercado',
  editorial: 'Editorial',
  noticia: 'Notícia',
}

interface BoletimCardProps {
  post: BoletimPost
}

export function BoletimCard({ post }: BoletimCardProps) {
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const dateLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })
    : null

  return (
    <article className="border border-[--color-paper-deep] overflow-hidden h-full flex flex-col hover:border-[--color-accent]/40 transition-colors duration-200 group">
      {post.hero_image_url ? (
        <Link
          href={`/boletim/${post.slug}`}
          className="block relative aspect-[16/9] bg-[--color-paper-muted] overflow-hidden"
        >
          <Image
            src={post.hero_image_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[--color-ink]/70 via-[--color-ink]/15 to-transparent"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-body text-[10px] uppercase tracking-[0.14em] text-[--color-accent] mb-1">
              {categoryLabel}
              {dateLabel && (
                <span className="text-[rgba(250,250,247,0.65)] ml-3">{dateLabel}</span>
              )}
            </p>
          </div>
        </Link>
      ) : (
        <BoletimHeroFallback title={post.title_pt} category={post.category} />
      )}

      <div className="p-6 flex flex-col flex-1">
        {!post.hero_image_url && (
          <p className="font-body text-[10px] uppercase tracking-[0.14em] text-[--color-accent] mb-3">
            {categoryLabel}
            {dateLabel && <span className="text-[--color-ink-subtle] ml-3">{dateLabel}</span>}
          </p>
        )}
        <h3 className="font-display text-[1.25rem] font-light text-[--color-ink] leading-snug mb-3 flex-1">
          <Link href={`/boletim/${post.slug}`} className="hover:text-[--color-accent] transition-colors">
            {post.title_pt}
          </Link>
        </h3>
        {post.excerpt_pt && (
          <p className="font-body text-[13px] leading-[1.7] text-[--color-ink-muted] mb-4 line-clamp-3">
            {post.excerpt_pt}
          </p>
        )}
        <Link
          href={`/boletim/${post.slug}`}
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:text-[--color-accent-deep] transition-colors mt-auto"
        >
          Ler análise →
        </Link>
      </div>
    </article>
  )
}
