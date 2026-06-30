import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { PLACEHOLDER_PIECES } from './pieces'
import { getArtistIdsBySlugs, upsertBySlug } from './utils'

type Db = SupabaseClient<Database>

export async function seedPieces(db: Db): Promise<{ created: number; ids: Record<string, string> }> {
  const slugs = [...new Set(PLACEHOLDER_PIECES.map((p) => p.artistSlug))]
  const artistIds = await getArtistIdsBySlugs(db, slugs)

  const ids: Record<string, string> = {}
  let created = 0

  for (const piece of PLACEHOLDER_PIECES) {
    const artistId = artistIds[piece.artistSlug]
    if (!artistId) throw new Error(`Artista não encontrado: ${piece.artistSlug}`)

    const { artistSlug: _slug, ...rest } = piece
    const payload = { ...rest, artist_id: artistId }

    const { data: existing } = await db.from('pieces').select('id').eq('internal_code', piece.internal_code).maybeSingle()
    const id = await upsertBySlug(db, 'pieces', piece.slug, payload)
    ids[piece.slug] = id
    if (!existing?.id) created++
  }

  return { created, ids }
}
