'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient } from '@cabral-souza/db'
import { getAdminUser } from '../../lib/supabase/server'

const ViewingRoomSchema = z.object({
  client_name: z.string().min(1, 'Nome do cliente obrigatório'),
  client_email: z.string().email().optional().nullable(),
  message_pt: z.string().optional().nullable(),
  notes_internal: z.string().optional().nullable(),
  expires_in_days: z.coerce.number().int().min(1).max(90).default(7),
  piece_ids: z.string().min(1, 'Selecione pelo menos uma peça'),
})

export async function createViewingRoom(formData: FormData) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const raw = Object.fromEntries(formData.entries())
  const parsed = ViewingRoomSchema.safeParse(raw)

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(', '))
  }

  const { client_name, client_email, message_pt, notes_internal, expires_in_days, piece_ids } = parsed.data

  const pieceIdsArray = piece_ids.split(',').map((id) => id.trim()).filter(Boolean)
  if (pieceIdsArray.length === 0) throw new Error('Selecione pelo menos uma peça')

  const supabase = createAdminClient()

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expires_in_days)

  const token = crypto.randomUUID().replace(/-/g, '')

  const { data, error } = await supabase
    .from('viewing_rooms')
    .insert([{
      client_name,
      client_email: client_email || null,
      message_pt: message_pt || null,
      notes_internal: notes_internal || null,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      created_by: user.id,
      token,
    }])
    .select('id, token')
    .single()

  if (error) throw new Error(error.message)

  // Associar peças ao viewing room
  const pieceRows = pieceIdsArray.map((pid, idx) => ({
    viewing_room_id: data.id,
    piece_id: pid,
    sort_order: idx,
  }))

  const { error: pieceError } = await supabase
    .from('viewing_room_pieces')
    .insert(pieceRows)

  if (pieceError) throw new Error(pieceError.message)

  revalidatePath('/admin/viewing-rooms')

  return { id: data.id, token: data.token as string }
}

export async function toggleViewingRoom(id: string, isActive: boolean) {
  const user = await getAdminUser()
  if (!user) throw new Error('Não autorizado')

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('viewing_rooms')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/viewing-rooms')
}
