import { createAdminClient } from '@cabral-souza/db'
import type { PieceListItem } from './pieces'
import { LIST_SELECT } from './pieces'

export type CollectionListItem = {
  id: string
  slug: string
  title_pt: string
  description_pt: string
  hero_image_url: string | null
  sort_order: number
  is_dynamic: boolean
  dynamic_kind: 'novidades' | 'sob_consulta' | null
  piece_count: number
  cover_image_url: string | null
}

type CollectionRow = {
  id: string
  slug: string
  title_pt: string
  description_pt: string
  hero_image_url: string | null
  sort_order: number
  is_dynamic: boolean
  dynamic_kind: string | null
}

const PUBLIC_STATUSES = ['publico', 'reservado'] as const

async function countDynamicPieces(kind: 'novidades' | 'sob_consulta'): Promise<number> {
  const db = createAdminClient()
  let query = db
    .from('pieces')
    .select('id', { count: 'exact', head: true })
    .in('status', [...PUBLIC_STATUSES])

  if (kind === 'sob_consulta') {
    query = query.eq('price_visibility', 'sob_consulta')
  } else {
    const since = new Date()
    since.setDate(since.getDate() - 30)
    query = query.gte('published_at', since.toISOString())
  }

  const { count, error } = await query
  if (error) {
    console.error('[countDynamicPieces]', error.message)
    return 0
  }
  return count ?? 0
}

async function getCoverImageForCollection(collectionId: string): Promise<string | null> {
  const db = createAdminClient()
  const { data: links } = await db
    .from('collection_pieces')
    .select('piece_id')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true })
    .limit(1)

  const pieceId = links?.[0]?.piece_id
  if (!pieceId) return null

  const { data: images } = await db
    .from('piece_images')
    .select('url_medium, url_original, is_primary, sort_order')
    .eq('piece_id', pieceId)
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(1)

  const img = images?.[0]
  return img?.url_medium ?? img?.url_original ?? null
}

export async function getPublishedCollections(): Promise<CollectionListItem[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('collections')
    .select('id, slug, title_pt, description_pt, hero_image_url, sort_order, is_dynamic, dynamic_kind')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getPublishedCollections]', error.message)
    return []
  }

  const rows = (data ?? []) as CollectionRow[]
  const results: CollectionListItem[] = []

  for (const row of rows) {
    let piece_count = 0
    let cover_image_url = row.hero_image_url

    if (row.is_dynamic && row.dynamic_kind) {
      piece_count = await countDynamicPieces(row.dynamic_kind as 'novidades' | 'sob_consulta')
    } else {
      const { data: links } = await db
        .from('collection_pieces')
        .select('piece_id')
        .eq('collection_id', row.id)

      const pieceIds = (links ?? []).map((l) => l.piece_id)
      if (pieceIds.length > 0) {
        const { count } = await db
          .from('pieces')
          .select('id', { count: 'exact', head: true })
          .in('id', pieceIds)
          .in('status', [...PUBLIC_STATUSES])
        piece_count = count ?? 0
      }

      if (!cover_image_url) {
        cover_image_url = await getCoverImageForCollection(row.id)
      }
    }

    results.push({
      ...row,
      dynamic_kind: row.dynamic_kind as CollectionListItem['dynamic_kind'],
      piece_count,
      cover_image_url,
    })
  }

  return results
}

export async function getCollectionBySlug(slug: string): Promise<CollectionListItem | null> {
  const collections = await getPublishedCollections()
  return collections.find((c) => c.slug === slug) ?? null
}

export async function getCollectionPieceIds(slug: string): Promise<string[] | null> {
  const db = createAdminClient()
  const { data: collection } = await db
    .from('collections')
    .select('id, is_dynamic, dynamic_kind')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!collection) return null

  if (collection.is_dynamic && collection.dynamic_kind === 'sob_consulta') {
    const { data } = await db
      .from('pieces')
      .select('id')
      .in('status', [...PUBLIC_STATUSES])
      .eq('price_visibility', 'sob_consulta')
      .order('created_at', { ascending: false })
    return (data ?? []).map((p) => p.id)
  }

  if (collection.is_dynamic && collection.dynamic_kind === 'novidades') {
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const { data } = await db
      .from('pieces')
      .select('id')
      .in('status', [...PUBLIC_STATUSES])
      .gte('published_at', since.toISOString())
      .order('published_at', { ascending: false })
    return (data ?? []).map((p) => p.id)
  }

  const { data: links } = await db
    .from('collection_pieces')
    .select('piece_id')
    .eq('collection_id', collection.id)
    .order('sort_order', { ascending: true })

  const pieceIds = (links ?? []).map((l) => l.piece_id)
  if (pieceIds.length === 0) return []

  const { data: publicPieces } = await db
    .from('pieces')
    .select('id')
    .in('id', pieceIds)
    .in('status', [...PUBLIC_STATUSES])

  const publicSet = new Set((publicPieces ?? []).map((p) => p.id))
  return pieceIds.filter((id) => publicSet.has(id))
}

export async function getPrimaryCollectionForPiece(
  pieceId: string,
): Promise<{ slug: string; title_pt: string } | null> {
  const db = createAdminClient()
  const { data } = await db
    .from('collection_pieces')
    .select('collections(slug, title_pt, is_published)')
    .eq('piece_id', pieceId)
    .limit(1)
    .maybeSingle()

  const collection = data?.collections as { slug: string; title_pt: string; is_published: boolean } | null
  if (!collection?.is_published) return null
  return { slug: collection.slug, title_pt: collection.title_pt }
}

export async function getPiecesByCollectionSlug(
  slug: string,
  limit = 48,
  offset = 0,
): Promise<PieceListItem[]> {
  const pieceIds = await getCollectionPieceIds(slug)
  if (!pieceIds || pieceIds.length === 0) return []

  const slice = pieceIds.slice(offset, offset + limit)
  if (slice.length === 0) return []

  const db = createAdminClient()
  const { data, error } = await db
    .from('pieces')
    .select(LIST_SELECT)
    .in('id', slice)
    .in('status', [...PUBLIC_STATUSES])

  if (error) {
    console.error('[getPiecesByCollectionSlug]', error.message)
    return []
  }

  const orderMap = new Map(slice.map((id, i) => [id, i]))
  return ((data ?? []) as unknown as PieceListItem[]).sort(
    (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0),
  )
}

export async function countCollectionPiecesBySlug(slug: string): Promise<number> {
  const ids = await getCollectionPieceIds(slug)
  return ids?.length ?? 0
}
