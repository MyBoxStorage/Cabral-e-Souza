import Link from 'next/link'
import type { BoletimPost } from '../../lib/queries/boletim'

interface BoletimCardProps {
  post: BoletimPost
}

export function BoletimCard({ post }: BoletimCardProps) {
  return (
    <article className="border border-[--color-paper-deep] p-6 h-full flex flex-col hover:border-[--color-accent]/40 transition-colors duration-200">
      {post.published_at && (
        <p className="font-body text-[10px] uppercase tracking-[0.14em] text-[--color-accent] mb-3">
          {new Date(post.published_at).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
          })}
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
    </article>
  )
}
