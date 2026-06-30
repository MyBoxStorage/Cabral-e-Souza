import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { BOLETIM_POSTS } from './content/boletim'
import { getArtistIdsBySlugs, upsertBySlug } from './utils'

type Db = SupabaseClient<Database>

export async function seedBoletim(db: Db): Promise<number> {
  const allSlugs = [...new Set(BOLETIM_POSTS.flatMap((p) => p.related_artists))]
  const artistIds = await getArtistIdsBySlugs(db, allSlugs)
  let count = 0

  for (const post of BOLETIM_POSTS) {
    const related_artists = post.related_artists
      .map((s) => artistIds[s])
      .filter(Boolean) as string[]

    const { slug, related_artists: _slugs, ...rest } = post
    await upsertBySlug(db, 'boletim_posts', slug, {
      ...rest,
      related_artists,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    count++
  }

  return count
}
