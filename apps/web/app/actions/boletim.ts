'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createAdminClient, type Database } from '@cabral-souza/db'

type BoletimInsert = Database['public']['Tables']['boletim_posts']['Insert']
type BoletimUpdate = Database['public']['Tables']['boletim_posts']['Update']
import { getAdminUser } from '../../lib/supabase/server'

const BoletimSchema = z.object({
  title_pt: z.string().min(1, 'Título obrigatório'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  category: z.enum(['analise_leilao', 'verbete_artista', 'mercado', 'editorial', 'noticia']).default('editorial'),
  excerpt_pt: z.string().optional().nullable(),
  content_pt: z.string().min(1, 'Conteúdo obrigatório'),
  is_published: z.coerce.boolean().default(false),
  hero_image_url: z.string().url().optional().nullable(),
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

export async function upsertBoletimPost(id: string | null, formData: FormData) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const raw = Object.fromEntries(formData.entries())

  const parsed = BoletimSchema.safeParse({
    ...raw,
    slug: raw['slug'] || (raw['title_pt'] ? slugify(raw['title_pt'] as string) : ''),
    hero_image_url: raw['hero_image_url'] || undefined,
    excerpt_pt: raw['excerpt_pt'] || undefined,
    is_published: raw['is_published'] === 'on' || raw['is_published'] === 'true',
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(', '))
  }

  const supabase = createAdminClient()
  const rawPayload = {
    ...parsed.data,
    published_at: parsed.data.is_published ? new Date().toISOString() : null,
  }

  const payload = Object.fromEntries(
    Object.entries(rawPayload).filter(([, v]) => v !== undefined)
  )

  if (id) {
    const { error } = await supabase.from('boletim_posts').update(payload as unknown as BoletimUpdate).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { data, error } = await supabase
      .from('boletim_posts')
      .insert([payload as unknown as BoletimInsert])
      .select('id')
      .single()

    if (error) throw new Error(error.message)
    id = data.id
  }

  revalidatePath('/admin/boletim')
  revalidatePath('/boletim')
  redirect(`/admin/boletim/${id}`)
}
