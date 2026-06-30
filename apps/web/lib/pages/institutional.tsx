import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InstitutionalCta } from '../../components/content/InstitutionalCta'
import { MarkdownContent } from '../../components/content/MarkdownContent'
import { buildPageMetadata } from '../seo/metadata'
import { getSitePageBySlug } from '../queries/site-pages'

export const revalidate = 3600

interface InstitutionalPageProps {
  slug: string
}

export async function buildInstitutionalMetadata(slug: string): Promise<Metadata> {
  const page = await getSitePageBySlug(slug)
  if (!page) return { title: 'Página não encontrada' }
  return buildPageMetadata({
    title: page.seo_title_pt ?? page.title_pt,
    description: page.seo_description_pt ?? undefined,
    path: `/${slug}`,
  })
}

export async function InstitutionalPage({ slug }: InstitutionalPageProps) {
  const page = await getSitePageBySlug(slug)
  if (!page) notFound()

  return (
    <>
      <section className="bg-[--color-paper-muted] border-b border-[--color-paper-deep] py-12 md:py-16">
        <div className="container-default">
          <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-light tracking-[-0.02em]">
            {page.title_pt}
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-default max-w-[72ch]">
          <MarkdownContent content={page.content_pt} />
        </div>
      </section>

      <InstitutionalCta />
    </>
  )
}
