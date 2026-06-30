import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MarkdownContent } from '../../../../../components/content/MarkdownContent'
import { ShareLinks } from '../../../../../components/content/ShareLinks'
import { JsonLd } from '../../../../../components/seo/JsonLd'
import { getBoletimPostBySlug, getBoletimSlugs } from '../../../../../lib/queries/boletim'
import { buildPageMetadata, getSiteUrl } from '../../../../../lib/seo/metadata'
import { articleSchema, breadcrumbSchema } from '../../../../../lib/seo/schema'

export const revalidate = 3600

interface BoletimPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getBoletimSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BoletimPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBoletimPostBySlug(slug)
  if (!post) return { title: 'Publicação não encontrada' }
  return buildPageMetadata({
    title: post.seo_title ?? post.title_pt,
    description: post.seo_description ?? post.excerpt_pt ?? undefined,
    path: `/boletim/${slug}`,
    ogType: 'article',
  })
}

export default async function BoletimPostPage({ params }: BoletimPostPageProps) {
  const { slug } = await params
  const post = await getBoletimPostBySlug(slug)
  if (!post) notFound()

  const postUrl = `${getSiteUrl()}/boletim/${slug}`

  const schema = [
    breadcrumbSchema([
      { name: 'Boletim', path: '/boletim' },
      { name: post.title_pt, path: `/boletim/${slug}` },
    ]),
    articleSchema({
      slug,
      title: post.title_pt,
      description: post.excerpt_pt,
      publishedAt: post.published_at,
      author: post.author,
    }),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-[--color-paper-muted] border-b border-[--color-paper-deep] py-12 md:py-16">
        <div className="container-default max-w-[72ch]">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 list-none font-body text-[12px] text-[--color-ink-subtle]">
              <li>
                <Link href="/boletim" className="hover:text-[--color-accent] transition-colors">
                  Boletim
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-[--color-ink] truncate max-w-[40ch]">
                {post.title_pt}
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-[2rem] md:text-[2.75rem] font-light tracking-[-0.02em] leading-[1.15]">
            {post.title_pt}
          </h1>

          {post.published_at && (
            <p className="font-body text-[12px] text-[--color-ink-subtle] mt-4">
              {new Date(post.published_at).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {post.author && ` · ${post.author}`}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-default max-w-[72ch]">
          <MarkdownContent content={post.content_pt} />
          <ShareLinks title={post.title_pt} url={postUrl} />
        </div>
      </section>
    </>
  )
}
