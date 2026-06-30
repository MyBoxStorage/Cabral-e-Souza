import { Resend } from 'resend'

let client: Resend | null = null

export function getResendClient(): Resend | null {
  const key = process.env['RESEND_API_KEY']
  if (!key || key.startsWith('re_...') || key.includes('your_api_key')) {
    return null
  }
  if (!client) client = new Resend(key)
  return client
}

export function getFromEmail(): string {
  return (
    process.env['FROM_EMAIL'] ??
    process.env['RESEND_FROM_EMAIL'] ??
    'contato@cabralesouza.com.br'
  )
}

export function getExecutorEmail(): string | null {
  const email = process.env['EXECUTOR_NOTIFICATION_EMAIL']
  if (!email || email.includes('seu-dominio')) return null
  return email
}

export function getSiteUrl(): string {
  return process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'
}
