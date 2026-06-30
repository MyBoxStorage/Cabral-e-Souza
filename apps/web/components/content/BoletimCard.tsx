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
    <article className="group flex flex-col h-full border border-cream-200 bg-cream-50 overflow-hidden hover:border-bronze-500/40 hover:shadow-md transition-[border-color,box-shadow] duration-base">
      {post.hero_image_url ? (
        <Link
          href={`/boletim/${post.slug}`}
          className="block relative aspect-[16/9] bg-cream-200 overflow-hidden"
        >
          <Image
            src={post.hero_image_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-slow group-hover:scale-[1.02]"
          />
        </Link>
      ) : (
        <Link href={`/boletim/${post.slug}`} className="block">
          <BoletimHeroFallback title={post.title_pt} category={post.category} />
        </Link>
      )}

      <div className="p-6 flex flex-col flex-1">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-3">
          {categoryLabel}
          {dateLabel && <span className="text-ink-700/60 ml-3 normal-case tracking-normal font-normal">{dateLabel}</span>}
        </p>

        <h3 className="font-display font-medium text-title-sm text-ink-800 leading-snug mb-3 flex-1">
          <Link href={`/boletim/${post.slug}`} className="hover:text-bronze-500 transition-colors duration-base">
            {post.title_pt}
          </Link>
        </h3>

        {post.excerpt_pt && (
          <p className="font-body text-body text-ink-700 mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt_pt}
          </p>
        )}

        <Link
          href={`/boletim/${post.slug}`}
          className="font-body text-body-sm font-medium text-bronze-500 hover:underline hover:underline-offset-4 mt-auto w-fit"
        >
          Ler análise →
        </Link>
      </div>
    </article>
  )
}
