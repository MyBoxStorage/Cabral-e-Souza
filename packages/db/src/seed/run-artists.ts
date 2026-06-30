import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { ARTIST_HERO_IMAGES, EXPANDED_BIOS } from './content/artists'

type Db = SupabaseClient<Database>

export async function seedArtists(db: Db): Promise<number> {
  let updated = 0

  for (const [slug, bio_pt] of Object.entries(EXPANDED_BIOS)) {
    const hero_image_url = ARTIST_HERO_IMAGES[slug]
    const { error } = await db
      .from('artists')
      .update({
        bio_pt,
        hero_image_url,
        is_published: true,
        needs_retranslation: false,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)

    if (error) throw new Error(`Erro ao atualizar artista ${slug}: ${error.message}`)
    updated++
  }

  return updated
}
