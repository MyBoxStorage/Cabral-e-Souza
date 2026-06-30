import { NextResponse } from 'next/server'
import { notifySourcingLeadCreated } from '../../../../lib/notifications/sourcing-lead'
import { type SupabaseWebhookPayload, verifyWebhookRequest } from '../../../../lib/webhooks/verify'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const verified = verifyWebhookRequest(rawBody, request.headers)
  if (!verified.ok) {
    return NextResponse.json({ error: verified.message }, { status: verified.status })
  }

  let payload: SupabaseWebhookPayload
  try {
    payload = JSON.parse(rawBody) as SupabaseWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.type !== 'INSERT' || payload.table !== 'sourcing_leads') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const leadId = payload.record?.['id']
  if (typeof leadId !== 'string') {
    return NextResponse.json({ error: 'Missing lead id' }, { status: 400 })
  }

  const result = await notifySourcingLeadCreated(leadId)
  return NextResponse.json({ ok: true, notifications: result })
}
