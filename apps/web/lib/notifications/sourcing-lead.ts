import { createAdminClient } from '@cabral-souza/db'
import { getExecutorEmail } from '../email/client'
import { sendEmail } from '../email/send'
import {
  sourcingLeadExecutorEmail,
  sourcingLeadSellerEmail,
  type SourcingLeadEmailData,
} from '../email/templates/sourcing-lead'

export async function notifySourcingLeadCreated(leadId: string): Promise<{
  executor: Awaited<ReturnType<typeof sendEmail>>
  seller: Awaited<ReturnType<typeof sendEmail>>
}> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('sourcing_leads')
    .select(
      'id, seller_name, seller_email, seller_phone, seller_city, artist_claimed, technique_claimed, notes_internal',
    )
    .eq('id', leadId)
    .single()

  if (error || !data) {
    console.error('[notifySourcingLeadCreated] lead not found', leadId, error?.message)
    return {
      executor: { ok: false, error: 'Lead not found' },
      seller: { ok: false, error: 'Lead not found' },
    }
  }

  const lead = data as SourcingLeadEmailData
  const executorEmail = getExecutorEmail()

  const executorTemplate = sourcingLeadExecutorEmail(lead)
  const sellerTemplate = sourcingLeadSellerEmail({ seller_name: lead.seller_name })

  const [executor, seller] = await Promise.all([
    executorEmail
      ? sendEmail({ to: executorEmail, ...executorTemplate })
      : Promise.resolve({ ok: false, skipped: true, error: 'EXECUTOR_NOTIFICATION_EMAIL missing' }),
    lead.seller_email
      ? sendEmail({ to: lead.seller_email, ...sellerTemplate })
      : Promise.resolve({ ok: false, skipped: true, error: 'seller email missing' }),
  ])

  return { executor, seller }
}

export function sourcingLeadFromWebhookRecord(
  record: Record<string, unknown>,
): SourcingLeadEmailData | null {
  const id = record['id']
  const seller_name = record['seller_name']
  if (typeof id !== 'string' || typeof seller_name !== 'string') return null

  return {
    id,
    seller_name,
    seller_email: typeof record['seller_email'] === 'string' ? record['seller_email'] : null,
    seller_phone: typeof record['seller_phone'] === 'string' ? record['seller_phone'] : null,
    seller_city: typeof record['seller_city'] === 'string' ? record['seller_city'] : null,
    artist_claimed: typeof record['artist_claimed'] === 'string' ? record['artist_claimed'] : null,
    technique_claimed: typeof record['technique_claimed'] === 'string' ? record['technique_claimed'] : null,
    notes_internal: typeof record['notes_internal'] === 'string' ? record['notes_internal'] : null,
  }
}
