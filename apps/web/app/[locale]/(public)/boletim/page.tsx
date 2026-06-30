import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedBoletimPosts } from '../../../../lib/queries/boletim'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Boletim',
  description:
    'Análises de leilão, tendências de mercado e editoriais sobre arte moderna e contemporânea brasileira pela curadoria Cabral & Souza.',
}

const CATEGORY_LABELS: Record<string, string> = {
  analise_leilao: 'Análise de Leilão',
  verbete_artista: 'Verbete',
  mercado: 'Mercado',
  editorial: 'Editorial',
  noticia: 'Notícia',
}

export default async function BoletimPage() {
  const posts = await getPublishedBoletimPosts()

  return (
    <>
      <section className="bg-[--color-paper-muted] border-b border-[--color-paper-deep] py-12 md:py-16">
        <div className="container-default">
          <p className="label-caps text-[--color-accent] mb-4">Boletim</p>
          <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-light tracking-[-0.02em]">
            Boletim Cabral &amp; Souza
          </h1>
          <p className="font-body text-[--color-ink-muted] mt-3 max-w-[56ch]">
            Análises de mercado, leituras de leilão e reflexões curatoriais sobre arte brasileira.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-default max-w-[72ch]">
          {posts.length === 0 ? (
            <p className="font-body text-[--color-ink-subtle]">Nenhuma publicação disponível.</p>
          ) : (
            <div className="flex flex-col gap-10">
              {posts.map((post) => (
                <article key={post.id} className="border-b border-[--color-paper-deep] pb-10 last:border-0">
                  <p className="font-body text-[10px] uppercase tracking-[0.14em] text-[--color-accent] mb-3">
                    {CATEGORY_LABELS[post.category] ?? post.category}
                    {post.published_at && (
                      <span className="text-[--color-ink-subtle] ml-3">
                        {new Date(post.published_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </p>
                  <h2 className="font-display text-[1.75rem] font-light text-[--color-ink] mb-3">
                    <Link href={`/boletim/${post.slug}`} className="hover:text-[--color-accent] transition-colors">
                      {post.title_pt}
                    </Link>
                  </h2>
                  {post.excerpt_pt && (
                    <p className="font-body text-[14px] leading-[1.7] text-[--color-ink-muted] mb-4">
                      {post.excerpt_pt}
                    </p>
                  )}
                  <Link
                    href={`/boletim/${post.slug}`}
                    className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:text-[--color-accent-deep] transition-colors"
                  >
                    Ler análise completa →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
