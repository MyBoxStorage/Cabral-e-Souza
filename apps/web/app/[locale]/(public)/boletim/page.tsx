import type { Metadata } from 'next'
import Link from 'next/link'
import { BoletimCard } from '../../../../components/content/BoletimCard'
import { JsonLd } from '../../../../components/seo/JsonLd'
import { getPublishedBoletimPosts } from '../../../../lib/queries/boletim'
import { buildPageMetadata, getSiteUrl } from '../../../../lib/seo/metadata'
import { collectionPageSchema } from '../../../../lib/seo/schema'

export const revalidate = 3600

export const metadata: Metadata = buildPageMetadata({
  title: 'Boletim',
  description:
    'Análises de leilão, tendências de mercado e editoriais sobre arte moderna e contemporânea brasileira pela curadoria Cabral & Souza.',
  path: '/boletim',
})

export default async function BoletimPage() {
  const posts = await getPublishedBoletimPosts()
  const siteUrl = getSiteUrl()

  const schema = collectionPageSchema({
    path: '/boletim',
    name: 'Boletim Cabral & Souza',
    description:
      'Análises de mercado, leituras de leilão e reflexões curatoriais sobre arte brasileira.',
    items: posts.map((post) => ({
      name: post.title_pt,
      url: `${siteUrl}/boletim/${post.slug}`,
    })),
  })

  return (
    <>
      <JsonLd data={schema} />
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
            <div className="text-center py-16">
              <p className="font-display text-[1.5rem] font-light text-[--color-ink-subtle] mb-3">
                Publicações em preparação
              </p>
              <p className="font-body text-[14px] text-[--color-ink-muted] mb-8">
                Em breve, análises de mercado e editoriais curatoriais.
              </p>
              <Link
                href="/contato"
                className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-paper] px-6 py-3 transition-colors"
              >
                Receber novidades
              </Link>
            </div>
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
