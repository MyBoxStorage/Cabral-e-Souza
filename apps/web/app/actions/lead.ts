'use server'

import { createAdminClient } from '@cabral-souza/db'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  consent_marketing: z.boolean(),
  piece_id: z.string().uuid().optional(),
  source: z.enum([
    'site_formulario', 'whatsapp', 'instagram', 'google_meu_negocio',
    'indicacao', 'newsletter', 'viewing_room', 'sourcing_form', 'outro',
  ]),
})

export type LeadPayload = z.infer<typeof leadSchema>

export async function submitLead(payload: LeadPayload): Promise<void> {
  const validated = leadSchema.safeParse(payload)
  if (!validated.success) {
    throw new Error('Dados inválidos: ' + validated.error.message)
  }

  const { name, email, phone, message, consent_marketing, piece_id, source } = validated.data

  const db = createAdminClient()
  const { data: inserted, error } = await db.from('leads').insert({
    name,
    email: email || null,
    phone: phone || null,
    source,
    piece_id: piece_id ?? null,
    consent_marketing,
    consent_at: consent_marketing ? new Date().toISOString() : null,
    notes_internal: message ? `Mensagem inicial: ${message}` : null,
  }).select('id').single()

  if (error || !inserted) {
    console.error('[submitLead]', error?.message)
    throw new Error('Erro ao registrar interesse. Tente novamente.')
  }

  const { notifyInterestLeadCreated } = await import('../../lib/notifications/interest-lead')
  notifyInterestLeadCreated(inserted.id).catch((err) => {
    console.error('[submitLead] notification failed', err)
  })
}

const LEAD_STATUSES = ['novo', 'qualificado', 'em_negociacao', 'ganho', 'perdido', 'descartado'] as const
type LeadStatus = (typeof LEAD_STATUSES)[number]

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (!LEAD_STATUSES.includes(status)) throw new Error('Status inválido')

  const db = createAdminClient()
  const { error } = await db.from('leads').update({ status }).eq('id', id)

  if (error) throw new Error(error.message)

  const { revalidatePath } = await import('next/cache')
  revalidatePath('/admin/leads')
}
