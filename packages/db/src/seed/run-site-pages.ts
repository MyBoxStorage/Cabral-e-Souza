import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { SITE_PAGES } from './content/site-pages'
import { upsertBySlug } from './utils'

type Db = SupabaseClient<Database>

export async function seedSitePages(db: Db): Promise<number> {
  const { error: probe } = await db.from('site_pages').select('id').limit(1)
  if (probe?.message?.includes('site_pages')) {
    console.warn('   ⚠ Tabela site_pages ausente — execute: pnpm db:migrate')
    return 0
  }

  let count = 0
  for (const page of SITE_PAGES) {
    const { slug, ...rest } = page
    await upsertBySlug(db, 'site_pages', slug, {
      ...rest,
      updated_at: new Date().toISOString(),
    })
    count++
  }
  return count
}
