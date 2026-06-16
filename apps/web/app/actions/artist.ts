'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createAdminClient, type Database } from '@cabral-souza/db'
import { getAdminUser } from '../../lib/supabase/server'

type ArtistInsert = Database['public']['Tables']['artists']['Insert']
type ArtistUpdate = Database['public']['Tables']['artists']['Update']

const ArtistSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug: apenas letras minúsculas, números e hífens'),
  nationality: z.string().optional().nullable(),
  birth_year: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().nullable(),
  death_year: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().nullable(),
  bio_pt: z.string().optional().nullable(),
  bio_en: z.string().optional().nullable(),
  bio_fr: z.string().optional().nullable(),
  is_published: z.coerce.boolean().default(false),
})

function slugify(str: string): string {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function upsertArtist(id: string | null, formData: FormData) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const raw = Object.fromEntries(formData.entries())

  const parsed = ArtistSchema.safeParse({
    ...raw,
    is_published: raw['is_published'] === 'on' || raw['is_published'] === 'true',
    birth_year: raw['birth_year'] || undefined,
    death_year: raw['death_year'] || undefined,
    slug: raw['slug'] || (raw['name'] ? slugify(raw['name'] as string) : ''),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(', '))
  }

  const supabase = createAdminClient()

  // Strip undefined values para compatibilidade com exactOptionalPropertyTypes
  const payload = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined)
  )

  if (id) {
    const { error } = await supabase
      .from('artists')
      .update(payload as unknown as ArtistUpdate)
      .eq('id', id)

    if (error) throw new Error(error.message)
  } else {
    const { data, error } = await supabase
      .from('artists')
      .insert([payload as unknown as ArtistInsert])
      .select('id')
      .single()

    if (error) throw new Error(error.message)
    id = data.id
  }

  revalidatePath('/admin/artistas')
  revalidatePath('/artistas')
  redirect(`/admin/artistas/${id}`)
}

export async function uploadArtistPhoto(artistId: string, formData: FormData) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const file = formData.get('file') as File | null
  if (!file) throw new Error('Arquivo não encontrado')

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const fileName = `${artistId}/photo.${ext}`

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .storage
    .from('artists')
    .upload(fileName, file, { contentType: file.type, upsert: true })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage.from('artists').getPublicUrl(data.path)

  await supabase.from('artists').update({ hero_image_url: publicUrl }).eq('id', artistId)

  revalidatePath(`/admin/artistas/${artistId}`)
  revalidatePath('/artistas')
}
