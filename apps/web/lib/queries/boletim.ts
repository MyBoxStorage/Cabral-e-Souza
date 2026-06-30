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
