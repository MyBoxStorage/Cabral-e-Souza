/**
 * Envia emails de teste para validar templates e Resend.
 * Uso: pnpm --filter=web exec tsx scripts/test-notifications.ts
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnv(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

const root = resolve(import.meta.dirname, '../../..')
loadEnv(resolve(root, 'apps/web/.env.local'))

async function main() {
  const { notifySourcingLeadCreated } = await import('../lib/notifications/sourcing-lead')
  const { notifyInterestLeadCreated } = await import('../lib/notifications/interest-lead')
  const { createAdminClient } = await import('@cabral-souza/db')
  const { sendEmail } = await import('../lib/email/send')
  const { getExecutorEmail } = await import('../lib/email/client')
  const { emailLayout } = await import('../lib/email/templates/layout')

  const executor = getExecutorEmail()
  console.log('Executor email:', executor ?? '(não configurado)')

  const ping = await sendEmail({
    to: executor ?? 'test@example.com',
    subject: '[Teste] Cabral & Souza — notificações',
    html: emailLayout({
      title: 'Teste de notificações',
      bodyHtml: '<p style="margin:0;">Este é um email de teste do sistema de notificações. Se você recebeu, o Resend está configurado corretamente.</p>',
    }),
  })
  console.log('Ping Resend:', ping)

  async function testSourcing() {
    const db = createAdminClient()
    const { data, error } = await db.from('sourcing_leads').insert({
      seller_name: 'Teste Notificação',
      seller_email: executor ?? 'test@example.com',
      seller_phone: '11999998888',
      seller_city: 'São Paulo',
      artist_claimed: 'Volpi (teste)',
      technique_claimed: 'pintura',
      acquisition_history: 'Lead de teste automatizado — pode ignorar.',
      notes_internal: 'Faixa expectativa: 20_80k',
      consent_data: true,
      consent_at: new Date().toISOString(),
      status: 'aguardando_analise',
    }).select('id').single()

    if (error || !data) {
      console.error('Sourcing insert failed:', error?.message)
      return
    }

    const result = await notifySourcingLeadCreated(data.id)
    console.log('Sourcing notifications:', result)
    await db.from('sourcing_leads').delete().eq('id', data.id)
  }

  async function testInterest() {
    const db = createAdminClient()
    const { data: piece } = await db.from('pieces').select('id, title_pt').limit(1).single()

    const { data, error } = await db.from('leads').insert({
      name: 'Teste Interesse',
      email: executor ?? 'test@example.com',
      phone: '11988887777',
      source: 'site_formulario',
      piece_id: piece?.id ?? null,
      consent_marketing: false,
      notes_internal: 'Mensagem inicial: Lead de teste automatizado.',
    }).select('id').single()

    if (error || !data) {
      console.error('Interest insert failed:', error?.message)
      return
    }

    const result = await notifyInterestLeadCreated(data.id)
    console.log('Interest notifications:', result)
    await db.from('leads').delete().eq('id', data.id)
  }

  const mode = process.argv[2] ?? 'all'
  if (mode === 'sourcing' || mode === 'all') await testSourcing()
  if (mode === 'interest' || mode === 'all') await testInterest()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
