import type { Metadata } from 'next'
import { PageHeader } from '@cabral-souza/ui'
import { notFound } from 'next/navigation'
import { MarkdownContent } from '../../components/content/MarkdownContent'
import { InstitutionalCta } from '../../components/institutional/InstitutionalCta'
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
      <PageHeader title={page.title_pt} />

      <section className="section-padding bg-cream-50">
        <div className="container-default max-w-narrow mx-auto">
          <MarkdownContent content={page.content_pt} variant="editorial" dropcap />
        </div>
      </section>

      <InstitutionalCta />
    </>
  )
}
