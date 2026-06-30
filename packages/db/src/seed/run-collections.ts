import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { COLLECTION_SEEDS } from './content/collections'

type Db = SupabaseClient<Database>

async function getPieceIdsBySlugs(db: Db, slugs: string[]): Promise<Record<string, string>> {
  if (slugs.length === 0) return {}
  const { data, error } = await db.from('pieces').select('id, slug').in('slug', slugs)
  if (error) throw new Error(`Erro ao buscar peças: ${error.message}`)
  return Object.fromEntries((data ?? []).map((p) => [p.slug, p.id]))
}

async function upsertCollection(
  db: Db,
  slug: string,
  payload: Database['public']['Tables']['collections']['Insert'],
): Promise<string> {
  const { data: existing } = await db.from('collections').select('id').eq('slug', slug).maybeSingle()
  if (existing?.id) {
    const { error } = await db.from('collections').update(payload).eq('id', existing.id)
    if (error) throw error
    return existing.id
  }
  const { data, error } = await db.from('collections').insert({ ...payload, slug }).select('id').single()
  if (error) throw error
  return data.id
}

export async function seedCollections(db: Db): Promise<number> {
  let count = 0

  for (const seed of COLLECTION_SEEDS) {
    const { pieceSlugs, is_dynamic, dynamic_kind, ...rest } = seed

    const collectionId = await upsertCollection(db, seed.slug, {
      ...rest,
      is_dynamic: is_dynamic ?? false,
      dynamic_kind: dynamic_kind ?? null,
      is_published: true,
    })

    if (!is_dynamic && pieceSlugs?.length) {
      const pieceIds = await getPieceIdsBySlugs(db, pieceSlugs)

      await db.from('collection_pieces').delete().eq('collection_id', collectionId)

      const rows: Database['public']['Tables']['collection_pieces']['Insert'][] = []
      pieceSlugs.forEach((slug, index) => {
        const pieceId = pieceIds[slug]
        if (!pieceId) {
          console.warn(`   ⚠ Peça não encontrada para coleção ${seed.slug}: ${slug}`)
          return
        }
        rows.push({ collection_id: collectionId, piece_id: pieceId, sort_order: index })
      })

      if (rows.length > 0) {
        const { error } = await db.from('collection_pieces').upsert(rows)
        if (error) throw new Error(`Erro ao vincular peças à coleção ${seed.slug}: ${error.message}`)
      }
    }

    count++
  }

  return count
}
