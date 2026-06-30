import { getSiteUrl } from '../client'
import { emailLayout, techniqueLabel, valueRangeLabel, whatsAppLink } from './layout'

export interface SourcingLeadEmailData {
  id: string
  seller_name: string
  seller_email: string | null
  seller_phone: string | null
  seller_city: string | null
  artist_claimed: string | null
  technique_claimed: string | null
  notes_internal: string | null
}

export function sourcingLeadExecutorEmail(data: SourcingLeadEmailData): { subject: string; html: string } {
  const siteUrl = getSiteUrl()
  const adminUrl = `${siteUrl}/admin/sourcing`
  const wa = whatsAppLink(
    data.seller_phone,
    `Olá ${data.seller_name}, sou da Cabral & Souza. Recebemos sua solicitação de avaliação de obra e gostaria de conversar.`,
  )

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#1a1a18;">Novo lead de sourcing</h1>
    <p style="margin:0 0 24px;color:#5c5c56;">Uma nova solicitação de venda de obra chegou pelo formulário <em>Vender obra</em>.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;font-size:13px;">
      <tr><td style="padding:6px 0;color:#8a8a82;width:120px;">Vendedor</td><td style="padding:6px 0;color:#1a1a18;"><strong>${data.seller_name}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Email</td><td style="padding:6px 0;"><a href="mailto:${data.seller_email}" style="color:#8b7355;">${data.seller_email ?? '—'}</a></td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Telefone</td><td style="padding:6px 0;color:#1a1a18;">${data.seller_phone ?? '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Cidade</td><td style="padding:6px 0;color:#1a1a18;">${data.seller_city ?? '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Tipo</td><td style="padding:6px 0;color:#1a1a18;">${techniqueLabel(data.technique_claimed)}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Artista</td><td style="padding:6px 0;color:#1a1a18;">${data.artist_claimed ?? 'Não informado'}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Faixa</td><td style="padding:6px 0;color:#1a1a18;">${valueRangeLabel(data.notes_internal)}</td></tr>
    </table>
    <p style="margin:0 0 12px;">
      <a href="${adminUrl}" style="display:inline-block;background:#1a1a18;color:#fafaf7;text-decoration:none;padding:12px 20px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Abrir no admin</a>
    </p>
    ${wa ? `<p style="margin:16px 0 0;"><a href="${wa}" style="color:#8b7355;font-size:13px;">Responder via WhatsApp →</a></p>` : ''}
    <p style="margin:24px 0 0;font-size:11px;color:#8a8a82;">ID: ${data.id}</p>
  `

  return {
    subject: `[Sourcing] Nova obra — ${data.seller_name}`,
    html: emailLayout({
      title: 'Novo lead de sourcing',
      preheader: `${data.seller_name} enviou uma obra para avaliação`,
      bodyHtml,
    }),
  }
}

export function sourcingLeadSellerEmail(data: Pick<SourcingLeadEmailData, 'seller_name'>): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#1a1a18;">Recebemos sua solicitação</h1>
    <p style="margin:0 0 16px;">Prezado(a) ${data.seller_name},</p>
    <p style="margin:0 0 16px;">Agradecemos o envio das informações sobre a obra. Nossa equipe de curadoria e proveniência analisará o material com a devida atenção.</p>
    <p style="margin:0 0 16px;"><strong>Prazo:</strong> retornaremos em até <strong>5 dias úteis</strong> com uma análise preliminar ou pedido de documentação complementar.</p>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a82;">Próximos passos</p>
    <ol style="margin:0 0 16px;padding-left:20px;color:#3d3d38;">
      <li style="margin-bottom:8px;">Análise documental e comparáveis de mercado</li>
      <li style="margin-bottom:8px;">Contato da nossa equipe, se necessário</li>
      <li>Proposta de consignação ou compra, quando aplicável</li>
    </ol>
    <p style="margin:0;">Com estima,<br /><span style="font-family:Georgia,serif;">Cabral &amp; Souza</span><br />Galeria de Arte</p>
  `

  return {
    subject: 'Recebemos sua solicitação — Cabral & Souza',
    html: emailLayout({
      title: 'Solicitação recebida',
      preheader: 'Retornaremos em até 5 dias úteis',
      bodyHtml,
    }),
  }
}
