'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createAdminClient, type Database } from '@cabral-souza/db'

type PieceInsert = Database['public']['Tables']['pieces']['Insert']
type PieceUpdate = Database['public']['Tables']['pieces']['Update']
import { getAdminUser } from '../../lib/supabase/server'

const PieceSchema = z.object({
  title_pt: z.string().min(1, 'Título obrigatório'),
  title_en: z.string().optional().nullable(),
  title_fr: z.string().optional().nullable(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug: apenas letras minúsculas, números e hífens'),
  internal_code: z.string().min(1, 'Código interno obrigatório'),
  artist_id: z.string().uuid('Artista inválido').optional().nullable(),
  attribution: z.enum([
    'autoria_confirmada', 'atribuido_a', 'circulo_de', 'escola_de',
    'seguidor_de', 'oficina_de', 'desconhecido',
  ]).default('autoria_confirmada'),
  origin: z.enum(['nacional', 'internacional', 'a_classificar']).default('a_classificar'),
  category: z.enum(['pintura', 'escultura', 'fotografia', 'gravura', 'desenho', 'instalacao', 'video', 'outro']),
  technique_pt: z.string().optional().nullable(),
  technique_en: z.string().optional().nullable(),
  technique_fr: z.string().optional().nullable(),
  year_created: z.coerce.number().int().min(1000).max(new Date().getFullYear() + 1).optional().nullable(),
  year_created_circa: z.coerce.boolean().default(false),
  height_cm: z.coerce.number().positive().optional().nullable(),
  width_cm: z.coerce.number().positive().optional().nullable(),
  depth_cm: z.coerce.number().positive().optional().nullable(),
  iphan_restricted: z.coerce.boolean().default(false),
  price_brl: z.coerce.number().positive().optional().nullable(),
  price_usd: z.coerce.number().positive().optional().nullable(),
  price_visibility: z.enum(['public', 'on_request', 'hidden']).default('on_request'),
  status: z.enum(['rascunho', 'privado', 'publico', 'reservado', 'vendido', 'arquivado']).default('rascunho'),
  description_pt: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  description_fr: z.string().optional().nullable(),
  provenance_pt: z.string().optional().nullable(),
  curator_notes_pt: z.string().optional().nullable(),
})

export type PieceFormData = z.infer<typeof PieceSchema>

function slugify(str: string): string {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function upsertPiece(id: string | null, formData: FormData) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const raw = Object.fromEntries(formData.entries())

  const coerceBool = (val: FormDataEntryValue | undefined) => val === 'on' || val === 'true'

  const parsed = PieceSchema.safeParse({
    ...raw,
    year_created_circa: coerceBool(raw['year_created_circa']),
    iphan_restricted: coerceBool(raw['iphan_restricted']),
    price_brl: raw['price_brl'] || undefined,
    price_usd: raw['price_usd'] || undefined,
    year_created: raw['year_created'] || undefined,
    height_cm: raw['height_cm'] || undefined,
    width_cm: raw['width_cm'] || undefined,
    depth_cm: raw['depth_cm'] || undefined,
    slug: raw['slug'] || (raw['title_pt'] ? slugify(raw['title_pt'] as string) : ''),
    internal_code: raw['internal_code'] || `CS-${Date.now()}`,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(', '))
  }

  const supabase = createAdminClient()

  const payload = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined)
  )

  if (id) {
    const { error } = await supabase
      .from('pieces')
      .update(payload as unknown as PieceUpdate)
      .eq('id', id)

    if (error) throw new Error(error.message)
  } else {
    const { data, error } = await supabase
      .from('pieces')
      .insert([payload as unknown as PieceInsert])
      .select('id')
      .single()

    if (error) throw new Error(error.message)
    id = data.id
  }

  revalidatePath('/admin/pecas')
  revalidatePath('/acervo')
  redirect(`/admin/pecas/${id}`)
}

export async function deletePiece(id: string) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const supabase = createAdminClient()
  const { error } = await supabase.from('pieces').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/pecas')
  revalidatePath('/acervo')
  redirect('/admin/pecas')
}

export async function uploadPieceImage(pieceId: string, formData: FormData) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const file = formData.get('file') as File | null
  if (!file) throw new Error('Arquivo não encontrado')

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const fileName = `${pieceId}/${crypto.randomUUID()}.${ext}`

  const supabase = createAdminClient()

  const { count } = await supabase
    .from('piece_images')
    .select('id', { count: 'exact', head: true })
    .eq('piece_id', pieceId)

  const sortOrder = count ?? 0
  const isPrimary = sortOrder === 0

  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('piece-images')
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error(uploadError.message)

  const { data: publicUrlData } = supabase.storage.from('piece-images').getPublicUrl(uploadData.path)

  const { error: dbError } = await supabase.from('piece_images').insert([{
    piece_id: pieceId,
    url_original: publicUrlData.publicUrl,
    storage_path: uploadData.path,
    is_primary: isPrimary,
    sort_order: sortOrder,
    image_type: 'principal',
  }])

  if (dbError) throw new Error(dbError.message)

  revalidatePath(`/admin/pecas/${pieceId}`)
  revalidatePath('/acervo')
}

export async function setPrimaryImage(imageId: string, pieceId: string) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const supabase = createAdminClient()
  await supabase.from('piece_images').update({ is_primary: false }).eq('piece_id', pieceId)
  const { error } = await supabase.from('piece_images').update({ is_primary: true }).eq('id', imageId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/pecas/${pieceId}`)
}

export async function deleteImage(imageId: string, pieceId: string) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const supabase = createAdminClient()
  const { data: image } = await supabase
    .from('piece_images')
    .select('storage_path, is_primary')
    .eq('id', imageId)
    .single()

  if (image?.storage_path) {
    await supabase.storage.from('piece-images').remove([image.storage_path])
  }

  await supabase.from('piece_images').delete().eq('id', imageId)

  if (image?.is_primary) {
    const { data: remaining } = await supabase
      .from('piece_images')
      .select('id')
      .eq('piece_id', pieceId)
      .order('sort_order', { ascending: true })
      .limit(1)

    if (remaining?.[0]) {
      await supabase.from('piece_images').update({ is_primary: true }).eq('id', remaining[0].id)
    }
  }

  revalidatePath(`/admin/pecas/${pieceId}`)
}
