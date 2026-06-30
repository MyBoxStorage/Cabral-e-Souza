import type { Metadata } from 'next'
import { PageHeader } from '@cabral-souza/ui'
import { notFound } from 'next/navigation'
import { ContactForm } from '../../../../components/content/ContactForm'
import { ContactChannels } from '../../../../components/institutional/ContactChannels'
import { ContactMap } from '../../../../components/institutional/ContactMap'
import { JsonLd } from '../../../../components/seo/JsonLd'
import { getSitePageBySlug } from '../../../../lib/queries/site-pages'
import { buildPageMetadata } from '../../../../lib/seo/metadata'
import { breadcrumbSchema } from '../../../../lib/seo/schema'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePageBySlug('contato')
  if (!page) return buildPageMetadata({ title: 'Contato', path: '/contato' })
  return buildPageMetadata({
    title: page.seo_title_pt ?? page.title_pt,
    description: page.seo_description_pt ?? undefined,
    path: '/contato',
  })
}

export default async function ContatoPage() {
  const page = await getSitePageBySlug('contato')
  if (!page) notFound()

  const schema = breadcrumbSchema([{ name: 'Contato', path: '/contato' }])

  return (
    <>
      <JsonLd data={schema} />

      <PageHeader section="Contato" title={page.title_pt} />

      <section className="section-padding bg-cream-50">
        <div className="container-default grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16">
          <ContactChannels />

          <aside className="lg:sticky lg:top-28 lg:self-start border border-cream-200 bg-cream-100 p-8 lg:p-10">
            <ContactForm />
          </aside>
        </div>
      </section>

      <section className="pb-16 lg:pb-20 bg-cream-50">
        <div className="container-default">
          <ContactMap />
        </div>
      </section>
    </>
  )
}
