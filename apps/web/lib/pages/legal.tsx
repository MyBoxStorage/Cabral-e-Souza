import type { Metadata } from 'next'
import { PageHeader } from '@cabral-souza/ui'
import { notFound } from 'next/navigation'
import { MarkdownContent } from '../../components/content/MarkdownContent'
import { LegalTableOfContents } from '../../components/institutional/LegalTableOfContents'
import { extractMarkdownSections } from '../markdown-sections'
import { buildPageMetadata } from '../seo/metadata'
import { getSitePageBySlug } from '../queries/site-pages'

export const revalidate = 3600

interface LegalPageProps {
  slug: string
}

export async function buildLegalMetadata(slug: string): Promise<Metadata> {
  const page = await getSitePageBySlug(slug)
  if (!page) return { title: 'Página não encontrada' }
  return buildPageMetadata({
    title: page.seo_title_pt ?? page.title_pt,
    description: page.seo_description_pt ?? undefined,
    path: `/${slug}`,
  })
}

export async function LegalPage({ slug }: LegalPageProps) {
  const page = await getSitePageBySlug(slug)
  if (!page) notFound()

  const sections = extractMarkdownSections(page.content_pt)

  return (
    <>
      <PageHeader title={page.title_pt} />

      <section className="section-padding bg-cream-50">
        <div className="container-default grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 lg:gap-16">
          <LegalTableOfContents sections={sections} />

          <div className="max-w-narrow min-w-0">
            <MarkdownContent content={page.content_pt} variant="editorial" headingAnchors />
          </div>
        </div>
      </section>
    </>
  )
}
