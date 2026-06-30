import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'

export const PLACEHOLDER_MARKER = 'PEÇA PLACEHOLDER — substituir por obra real pós dia 16'

type Db = SupabaseClient<Database>

export async function getArtistIdBySlug(db: Db, slug: string): Promise<string> {
  const { data, error } = await db.from('artists').select('id').eq('slug', slug).single()
  if (error || !data) throw new Error(`Artista não encontrado: ${slug}`)
  return data.id
}

export async function getArtistIdsBySlugs(db: Db, slugs: string[]): Promise<Record<string, string>> {
  const { data, error } = await db.from('artists').select('id, slug').in('slug', slugs)
  if (error) throw error
  const map: Record<string, string> = {}
  for (const row of data ?? []) map[row.slug] = row.id
  return map
}

export async function upsertBySlug<T extends Record<string, unknown>>(
  db: Db,
  table: 'pieces' | 'boletim_posts' | 'site_pages',
  slug: string,
  payload: T,
): Promise<string> {
  const { data: existing } = await db.from(table).select('id').eq('slug', slug).maybeSingle()

  if (existing?.id) {
    const { error } = await db.from(table).update(payload).eq('id', existing.id)
    if (error) throw error
    return existing.id
  }

  const { data, error } = await db.from(table).insert({ ...payload, slug }).select('id').single()
  if (error) throw error
  return data.id
}

export async function ensureSitePagesTable(db: Db): Promise<void> {
  // Tabela criada via migration; seed apenas verifica acesso
  const { error } = await db.from('site_pages').select('id').limit(1)
  if (error?.message?.includes('site_pages')) {
    throw new Error(
      'Tabela site_pages não existe. Execute packages/db/migrations/0002_site_pages.sql no Supabase primeiro.',
    )
  }
}
