import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactForm } from '../../../../components/content/ContactForm'
import { MarkdownContent } from '../../../../components/content/MarkdownContent'
import { getSitePageBySlug } from '../../../../lib/queries/site-pages'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePageBySlug('contato')
  if (!page) return { title: 'Contato' }
  return {
    title: page.seo_title_pt ?? page.title_pt,
    description: page.seo_description_pt ?? undefined,
  }
}

export default async function ContatoPage() {
  const page = await getSitePageBySlug('contato')
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
        <div className="container-default grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          <div className="max-w-[56ch]">
            <MarkdownContent content={page.content_pt} />
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start border border-[--color-paper-deep] p-8">
            <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-6">
              Envie uma mensagem
            </h2>
            <ContactForm />
          </aside>
        </div>
      </section>
    </>
  )
}
