import { createAdminClient } from '@cabral-souza/db'
import type { Database } from '@cabral-souza/db'

export type BoletimPost = Database['public']['Tables']['boletim_posts']['Row']

export async function getPublishedBoletimPosts(limit = 24): Promise<BoletimPost[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('boletim_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getPublishedBoletimPosts]', error.message)
    return []
  }
  return data ?? []
}

export async function getBoletimPostBySlug(slug: string): Promise<BoletimPost | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('boletim_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getBoletimPostBySlug]', error.message)
    return null
  }
  return data
}

export async function getBoletimSlugs(): Promise<string[]> {
  const db = createAdminClient()
  const { data } = await db
    .from('boletim_posts')
    .select('slug')
    .eq('is_published', true)

  return (data ?? []).map((p) => p.slug)
}

export async function getAdjacentBoletimPosts(slug: string): Promise<{
  prev: Pick<BoletimPost, 'slug' | 'title_pt'> | null
  next: Pick<BoletimPost, 'slug' | 'title_pt'> | null
}> {
  const posts = await getPublishedBoletimPosts(100)
  const index = posts.findIndex((p) => p.slug === slug)
  if (index === -1) return { prev: null, next: null }

  const prev = index > 0 ? posts[index - 1] : null
  const next = index < posts.length - 1 ? posts[index + 1] : null

  return {
    prev: prev ? { slug: prev.slug, title_pt: prev.title_pt } : null,
    next: next ? { slug: next.slug, title_pt: next.title_pt } : null,
  }
}

export function estimateReadingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
