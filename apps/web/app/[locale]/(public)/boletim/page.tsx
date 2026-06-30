import type { Metadata } from 'next'
import { PageHeader } from '@cabral-souza/ui'
import Link from 'next/link'
import { BoletimCard } from '../../../../components/content/BoletimCard'
import { Reveal } from '../../../../components/ui/Reveal'
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

  const [featured, ...rest] = posts

  return (
    <>
      <JsonLd data={schema} />

      <PageHeader
        section="Boletim"
        title="Boletim Cabral & Souza"
        subtitle="Análises de mercado, leituras de leilão e reflexões curatoriais sobre arte brasileira."
      />

      <section className="section-padding bg-cream-50">
        <div className="container-default">
          {posts.length === 0 ? (
            <div className="text-center py-16 max-w-narrow mx-auto">
              <p className="font-display text-title-sm font-normal text-ink-700/50 mb-3">
                Publicações em preparação
              </p>
              <p className="font-body text-body text-ink-700 mb-8">
                Em breve, análises de mercado e editoriais curatoriais.
              </p>
              <Link
                href="/contato"
                className="inline-block font-body text-eyebrow font-medium uppercase tracking-caps text-ink-800 border border-ink-800 hover:bg-ink-800 hover:text-cream-100 px-6 py-3 transition-colors duration-base"
              >
                Receber novidades
              </Link>
            </div>
          ) : (
            <>
              {featured && (
                <Reveal>
                  <div className="mb-12 lg:mb-16">
                    <BoletimCard post={featured} />
                  </div>
                </Reveal>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={Math.min(i * 80, 400)}>
                      <BoletimCard post={post} />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
