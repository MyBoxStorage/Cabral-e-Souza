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
  const { error } = await db.from('leads').insert({
    name,
    email: email || null,
    phone: phone || null,
    source,
    piece_id: piece_id ?? null,
    consent_marketing,
    consent_at: consent_marketing ? new Date().toISOString() : null,
    notes_internal: message ? `Mensagem inicial: ${message}` : null,
  })

  if (error) {
    console.error('[submitLead]', error.message)
    throw new Error('Erro ao registrar interesse. Tente novamente.')
  }
}
