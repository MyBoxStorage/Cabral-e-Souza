import { createHmac, timingSafeEqual } from 'node:crypto'

function getWebhookSecret(): string | undefined {
  return process.env['WEBHOOK_SHARED_SECRET'] ?? process.env['WPP_SHARED_SECRET']
}

/** Valida HMAC-SHA256 (header x-webhook-signature: sha256=<hex>) ou Bearer token. */
export function verifyWebhookRequest(
  rawBody: string,
  headers: Headers,
): { ok: true } | { ok: false; status: number; message: string } {
  const secret = getWebhookSecret()
  if (!secret || secret.includes('your-') || secret.includes('gere_um')) {
    return { ok: false, status: 503, message: 'Webhook secret not configured' }
  }

  const auth = headers.get('authorization')
  if (auth === `Bearer ${secret}`) return { ok: true }

  const signature = headers.get('x-webhook-signature')
  if (signature) {
    const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`
    try {
      const a = Buffer.from(signature)
      const b = Buffer.from(expected)
      if (a.length === b.length && timingSafeEqual(a, b)) return { ok: true }
    } catch {
      /* fall through */
    }
  }

  return { ok: false, status: 401, message: 'Invalid webhook signature' }
}

export interface SupabaseWebhookPayload<T = Record<string, unknown>> {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: T
  old_record: T | null
}
