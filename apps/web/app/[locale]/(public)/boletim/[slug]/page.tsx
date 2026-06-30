import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/ButtonLink'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BoletimHeroFallback } from '../../../../../components/content/BoletimHeroFallback'
import { MarkdownContent } from '../../../../../components/content/MarkdownContent'
import { ShareLinks } from '../../../../../components/content/ShareLinks'
import { JsonLd } from '../../../../../components/seo/JsonLd'
import {
  estimateReadingTimeMinutes,
  getAdjacentBoletimPosts,
  getBoletimPostBySlug,
  getBoletimSlugs,
} from '../../../../../lib/queries/boletim'
import { buildPageMetadata, getSiteUrl } from '../../../../../lib/seo/metadata'
import { articleSchema, breadcrumbSchema } from '../../../../../lib/seo/schema'

export const revalidate = 3600

const CATEGORY_LABELS: Record<string, string> = {
  analise_leilao: 'Análise de Leilão',
  verbete_artista: 'Verbete',
  mercado: 'Mercado',
  editorial: 'Editorial',
  noticia: 'Notícia',
}

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
    ...(post.hero_image_url ? { ogImage: post.hero_image_url } : {}),
  })
}

export default async function BoletimPostPage({ params }: BoletimPostPageProps) {
  const { slug } = await params
  const post = await getBoletimPostBySlug(slug)
  if (!post) notFound()

  const postUrl = `${getSiteUrl()}/boletim/${slug}`
  const { prev, next } = await getAdjacentBoletimPosts(slug)
  const readingTime = estimateReadingTimeMinutes(post.content_pt)
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category

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

      {/* Cabeçalho editorial */}
      <header className="bg-cream-100 border-b border-cream-200 pt-12 lg:pt-16 pb-10">
        <div className="container-default max-w-narrow mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center justify-center gap-2 list-none font-body text-body-sm text-ink-700">
              <li>
                <Link href="/boletim" className="hover:text-bronze-500 transition-colors duration-base">
                  Boletim
                </Link>
              </li>
              <li aria-hidden className="text-ink-700/40">
                /
              </li>
              <li aria-current="page" className="text-ink-800 truncate max-w-[32ch]">
                {categoryLabel}
              </li>
            </ol>
          </nav>

          <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
            {categoryLabel}
          </p>

          <h1 className="font-display font-normal text-title-md text-ink-800 leading-tight mx-auto max-w-[14ch]">
            {post.title_pt}
          </h1>

          <p className="font-body text-body-sm text-ink-700 mt-6">
            {post.published_at &&
              new Date(post.published_at).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            {post.author && ` · ${post.author}`}
            {` · ${readingTime} min de leitura`}
          </p>
        </div>
      </header>

      {/* Hero 21:9 */}
      <div className="relative w-full aspect-[21/9] bg-cream-200 overflow-hidden">
        {post.hero_image_url ? (
          <Image
            src={post.hero_image_url}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <BoletimHeroFallback title={post.title_pt} category={post.category} fullBleed />
        )}
      </div>

      {/* Corpo editorial */}
      <article className="section-padding bg-cream-50">
        <div className="container-default max-w-narrow mx-auto">
          {post.excerpt_pt && (
            <p className="font-display italic text-title-xs text-ink-800 leading-snug text-center mb-12 max-w-[52ch] mx-auto">
              {post.excerpt_pt}
            </p>
          )}

          <MarkdownContent content={post.content_pt} variant="editorial" dropcap />
          <ShareLinks title={post.title_pt} url={postUrl} />
        </div>
      </article>

      {/* Navegação prev/next */}
      {(prev || next) && (
        <nav
          aria-label="Navegação entre publicações"
          className="border-t border-cream-200 bg-cream-100"
        >
          <div className="container-default max-w-wide py-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {prev ? (
              <Link
                href={`/boletim/${prev.slug}`}
                className="group p-6 border border-cream-200 hover:border-bronze-500/40 transition-colors duration-base"
              >
                <span className="font-body text-eyebrow uppercase tracking-caps text-bronze-500 block mb-2">
                  ← Anterior
                </span>
                <span className="font-display text-title-xs text-ink-800 group-hover:text-bronze-500 transition-colors duration-base line-clamp-2">
                  {prev.title_pt}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/boletim/${next.slug}`}
                className="group p-6 border border-cream-200 hover:border-bronze-500/40 transition-colors duration-base text-right sm:col-start-2"
              >
                <span className="font-body text-eyebrow uppercase tracking-caps text-bronze-500 block mb-2">
                  Próximo →
                </span>
                <span className="font-display text-title-xs text-ink-800 group-hover:text-bronze-500 transition-colors duration-base line-clamp-2">
                  {next.title_pt}
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      )}

      {/* Newsletter CTA */}
      <section className="bg-ink-900 text-cream-100 py-16 lg:py-20">
        <div className="container-default max-w-narrow mx-auto text-center">
          <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
            Boletim
          </p>
          <h2 className="font-display text-title-sm font-normal mb-4">
            Receba análises de mercado e editoriais curatoriais
          </h2>
          <p className="font-body text-body text-cream-300/80 mb-8 max-w-[48ch] mx-auto">
            Cadastre-se para receber as próximas publicações do Boletim Cabral &amp; Souza.
          </p>
          <ButtonLink href="/contato" variant="primary">
            Inscrever-se
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
