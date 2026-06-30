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

export type ArtistComparable = {
  id: string
  auction_house: string
  auction_date: string
  work_title: string | null
  work_year: number | null
  hammer_price: number | null
  currency: string | null
  currency_at_brl: number | null
}

export async function getArtistAuctionComparables(artistId: string): Promise<ArtistComparable[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('auction_comparables')
    .select('id,auction_house,auction_date,work_title,work_year,hammer_price,currency,currency_at_brl')
    .eq('artist_id', artistId)
    .order('auction_date', { ascending: false })
    .limit(12)

  if (error) {
    console.error('[getArtistAuctionComparables]', error.message)
    return []
  }
  return data ?? []
}
