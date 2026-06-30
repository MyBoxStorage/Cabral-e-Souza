import { getFromEmail, getResendClient } from './client'

export interface SendEmailInput {
  to: string | string[]
  subject: string
  html: string
}

export interface SendEmailResult {
  ok: boolean
  id?: string
  error?: string
  skipped?: boolean
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resend = getResendClient()
  if (!resend) {
    console.warn('[sendEmail] RESEND_API_KEY não configurada — email não enviado')
    return { ok: false, skipped: true, error: 'RESEND_API_KEY missing' }
  }

  const from = getFromEmail()
  const { data, error } = await resend.emails.send({
    from: `Cabral & Souza <${from}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
  })

  if (error) {
    console.error('[sendEmail]', error.message)
    return { ok: false, error: error.message }
  }

  return { ok: true, id: data?.id }
}
