import { createAdminClient } from '@cabral-souza/db'
import type { Database } from '@cabral-souza/db'

type ArtistRow = Database['public']['Tables']['artists']['Row']

export type ArtistListItem = Pick<
  ArtistRow,
  | 'id' | 'slug' | 'name' | 'birth_year' | 'death_year'
  | 'nationality' | 'schools' | 'hero_image_url' | 'is_published'
>

export type ArtistDetail = ArtistRow

export async function getPublishedArtists(): Promise<ArtistListItem[]> {
  const db = createAdminClient()

  const { data, error } = await db
    .from('artists')
    .select('id,slug,name,birth_year,death_year,nationality,schools,hero_image_url,is_published')
    .eq('is_published', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('[getPublishedArtists]', error.message)
    return []
  }

  return (data ?? []) as ArtistListItem[]
}

export async function getArtistBySlug(slug: string): Promise<ArtistDetail | null> {
  const db = createAdminClient()

  const { data, error } = await db
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[getArtistBySlug]', error.message)
    }
    return null
  }

  return data as ArtistDetail
}

export async function getArtistSlugs(): Promise<string[]> {
  const db = createAdminClient()
  const { data } = await db
    .from('artists')
    .select('slug')
    .eq('is_published', true)

  return (data ?? []).map((a) => a.slug)
}
