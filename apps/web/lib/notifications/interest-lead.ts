import { createAdminClient } from '@cabral-souza/db'
import { getExecutorEmail } from '../email/client'
import { sendEmail } from '../email/send'
import {
  interestLeadBuyerEmail,
  interestLeadExecutorEmail,
  type InterestLeadEmailData,
} from '../email/templates/interest-lead'

async function loadInterestLead(leadId: string): Promise<InterestLeadEmailData | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('leads')
    .select('id, name, email, phone, notes_internal, piece_id')
    .eq('id', leadId)
    .single()

  if (error || !data) {
    console.error('[notifyInterestLeadCreated] lead not found', leadId, error?.message)
    return null
  }

  let piece_title: string | null = null
  let piece_slug: string | null = null

  if (data.piece_id) {
    const { data: piece } = await db
      .from('pieces')
      .select('title_pt, slug')
      .eq('id', data.piece_id)
      .single()
    piece_title = piece?.title_pt ?? null
    piece_slug = piece?.slug ?? null
  }

  const message = data.notes_internal?.startsWith('Mensagem inicial: ')
    ? data.notes_internal.replace('Mensagem inicial: ', '')
    : data.notes_internal

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: message ?? null,
    piece_title,
    piece_slug,
  }
}

export async function notifyInterestLeadCreated(leadId: string): Promise<{
  executor: Awaited<ReturnType<typeof sendEmail>>
  buyer: Awaited<ReturnType<typeof sendEmail>>
}> {
  const lead = await loadInterestLead(leadId)
  if (!lead) {
    return {
      executor: { ok: false, error: 'Lead not found' },
      buyer: { ok: false, error: 'Lead not found' },
    }
  }

  const executorEmail = getExecutorEmail()
  const executorTemplate = interestLeadExecutorEmail(lead)
  const buyerTemplate = interestLeadBuyerEmail({
    name: lead.name,
    piece_title: lead.piece_title,
  })

  const [executor, buyer] = await Promise.all([
    executorEmail
      ? sendEmail({ to: executorEmail, ...executorTemplate })
      : Promise.resolve({ ok: false, skipped: true, error: 'EXECUTOR_NOTIFICATION_EMAIL missing' }),
    lead.email
      ? sendEmail({ to: lead.email, ...buyerTemplate })
      : Promise.resolve({ ok: false, skipped: true, error: 'buyer email missing' }),
  ])

  return { executor, buyer }
}

export function interestLeadFromWebhookRecord(
  record: Record<string, unknown>,
): { id: string } | null {
  const id = record['id']
  if (typeof id !== 'string') return null
  return { id }
}
