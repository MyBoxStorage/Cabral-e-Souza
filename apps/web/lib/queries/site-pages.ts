import { SITE_PAGES, type SitePageSeed } from '@cabral-souza/db/seed/content/site-pages'
import { createAdminClient } from '@cabral-souza/db'

export type SitePage = SitePageSeed

export async function getSitePageBySlug(slug: string): Promise<SitePage | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('site_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!error && data) {
    return {
      slug: data.slug,
      title_pt: data.title_pt,
      seo_title_pt: data.seo_title_pt ?? data.title_pt,
      seo_description_pt: data.seo_description_pt ?? '',
      content_pt: data.content_pt,
      is_published: data.is_published,
    }
  }

  return SITE_PAGES.find((p) => p.slug === slug) ?? null
}
