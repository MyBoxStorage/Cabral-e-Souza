import type { Metadata } from 'next'
import { BoletimCard } from '../../../../components/content/BoletimCard'
import { getPublishedBoletimPosts } from '../../../../lib/queries/boletim'
import { buildPageMetadata } from '../../../../lib/seo/metadata'

export const revalidate = 3600

export const metadata: Metadata = buildPageMetadata({
  title: 'Boletim',
  description:
    'Análises de leilão, tendências de mercado e editoriais sobre arte moderna e contemporânea brasileira pela curadoria Cabral & Souza.',
  path: '/boletim',
})

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <BoletimCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
