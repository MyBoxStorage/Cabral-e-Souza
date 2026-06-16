import { createAdminClient } from '@cabral-souza/db'
import type { Database } from '@cabral-souza/db'

type PieceRow = Database['public']['Tables']['pieces']['Row']
type ArtistRow = Database['public']['Tables']['artists']['Row']
type ImageRow = Database['public']['Tables']['piece_images']['Row']
type ComparableRow = Database['public']['Tables']['auction_comparables']['Row']

export type PieceImage = Pick<
  ImageRow,
  'id' | 'url_original' | 'url_large' | 'url_medium' | 'url_thumbnail' | 'alt_text_pt' | 'is_primary' | 'sort_order' | 'image_type'
>

export type PieceArtist = Pick<ArtistRow, 'id' | 'name' | 'slug' | 'nationality' | 'birth_year' | 'death_year'>

export type PieceListItem = Pick<
  PieceRow,
  | 'id' | 'slug' | 'title_pt' | 'title_en' | 'title_fr'
  | 'category' | 'technique_pt' | 'year_created' | 'year_created_circa'
  | 'price_brl' | 'price_visibility' | 'status'
  | 'height_cm' | 'width_cm'
> & {
  artists: PieceArtist | null
  piece_images: PieceImage[]
}

export type PieceDetail = PieceRow & {
  artists: PieceArtist | null
  piece_images: PieceImage[]
  auction_comparables: Pick<
    ComparableRow,
    'id' | 'auction_house' | 'auction_date' | 'work_title' | 'work_year'
    | 'technique' | 'height_cm' | 'width_cm' | 'hammer_price' | 'currency'
    | 'currency_at_brl' | 'estimate_low' | 'estimate_high'
  >[]
}

type PieceCategory = PieceRow['category']

export interface PieceFilters {
  artistSlug?: string
  category?: PieceCategory
  yearFrom?: number
  yearTo?: number
  search?: string
  limit?: number
  offset?: number
}

const IMAGE_SELECT =
  'id,url_original,url_large,url_medium,url_thumbnail,alt_text_pt,is_primary,sort_order,image_type'

const ARTIST_SELECT = 'id,name,slug,nationality,birth_year,death_year'

const LIST_SELECT = `
  id,slug,title_pt,title_en,title_fr,
  category,technique_pt,year_created,year_created_circa,
  price_brl,price_visibility,status,
  height_cm,width_cm,
  artists(${ARTIST_SELECT}),
  piece_images(${IMAGE_SELECT})
`.replace(/\s+/g, ' ').trim()

export async function getPublicPieces(filters: PieceFilters = {}): Promise<PieceListItem[]> {
  const db = createAdminClient()
  const { limit = 48, offset = 0, artistSlug, category, yearFrom, yearTo, search } = filters

  let query = db
    .from('pieces')
    .select(LIST_SELECT)
    .eq('status', 'publico')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (artistSlug) {
    // Filtra pelo slug do artista via join
    const { data: artist } = await db
      .from('artists')
      .select('id')
      .eq('slug', artistSlug)
      .single()
    if (artist) query = query.eq('artist_id', artist.id)
  }

  if (category) query = query.eq('category', category)
  if (yearFrom) query = query.gte('year_created', yearFrom)
  if (yearTo) query = query.lte('year_created', yearTo)
  if (search) query = query.ilike('title_pt', `%${search}%`)

  const { data, error } = await query

  if (error) {
    console.error('[getPublicPieces]', error.message)
    return []
  }

  return (data ?? []) as unknown as PieceListItem[]
}

export async function getPieceBySlug(slug: string): Promise<PieceDetail | null> {
  const db = createAdminClient()

  const { data, error } = await db
    .from('pieces')
    .select(`
      *,
      artists(${ARTIST_SELECT}),
      piece_images(${IMAGE_SELECT}),
      auction_comparables(
        id,auction_house,auction_date,work_title,work_year,
        technique,height_cm,width_cm,hammer_price,currency,
        currency_at_brl,estimate_low,estimate_high
      )
    `)
    .eq('slug', slug)
    .eq('status', 'publico')
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[getPieceBySlug]', error.message)
    }
    return null
  }

  return data as unknown as PieceDetail
}

export async function getPieceSlugs(): Promise<string[]> {
  const db = createAdminClient()
  const { data } = await db
    .from('pieces')
    .select('slug')
    .eq('status', 'publico')

  return (data ?? []).map((p) => p.slug)
}

/** Preço exibível conforme regra de negócio:
 * - price_visibility = 'publico' AND price_brl < 20000 → formatar
 * - qualquer outra combinação → null (exibe "Sob Consulta")
 */
export function getDisplayPrice(piece: Pick<PieceRow, 'price_brl' | 'price_visibility'>): number | null {
  if (piece.price_visibility === 'publico' && piece.price_brl !== null && piece.price_brl < 20000) {
    return piece.price_brl
  }
  return null
}
