import { getSiteUrl } from '../client'
import { emailLayout, whatsAppLink } from './layout'

export interface InterestLeadEmailData {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string | null
  piece_title: string | null
  piece_slug: string | null
}

export function interestLeadExecutorEmail(data: InterestLeadEmailData): { subject: string; html: string } {
  const siteUrl = getSiteUrl()
  const adminUrl = `${siteUrl}/admin/leads`
  const pieceUrl = data.piece_slug ? `${siteUrl}/acervo/${data.piece_slug}` : null
  const wa = whatsAppLink(
    data.phone,
    data.piece_title
      ? `Olá ${data.name}, sou da Cabral & Souza. Vi seu interesse na obra "${data.piece_title}" e gostaria de conversar.`
      : `Olá ${data.name}, sou da Cabral & Souza. Vi seu interesse e gostaria de conversar.`,
  )

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#1a1a18;">Novo interesse em obra</h1>
    <p style="margin:0 0 24px;color:#5c5c56;">Um visitante manifestou interesse pelo formulário do acervo.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;font-size:13px;">
      <tr><td style="padding:6px 0;color:#8a8a82;width:120px;">Nome</td><td style="padding:6px 0;color:#1a1a18;"><strong>${data.name}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Email</td><td style="padding:6px 0;"><a href="mailto:${data.email}" style="color:#8b7355;">${data.email ?? '—'}</a></td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Telefone</td><td style="padding:6px 0;color:#1a1a18;">${data.phone ?? '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8a82;">Obra</td><td style="padding:6px 0;color:#1a1a18;">${pieceUrl ? `<a href="${pieceUrl}" style="color:#8b7355;">${data.piece_title}</a>` : (data.piece_title ?? '—')}</td></tr>
      ${data.message ? `<tr><td style="padding:6px 0;color:#8a8a82;vertical-align:top;">Mensagem</td><td style="padding:6px 0;color:#1a1a18;">${data.message}</td></tr>` : ''}
    </table>
    <p style="margin:0 0 12px;">
      <a href="${adminUrl}" style="display:inline-block;background:#1a1a18;color:#fafaf7;text-decoration:none;padding:12px 20px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Abrir no admin</a>
    </p>
    ${wa ? `<p style="margin:16px 0 0;"><a href="${wa}" style="color:#8b7355;font-size:13px;">Responder via WhatsApp →</a></p>` : ''}
    <p style="margin:24px 0 0;font-size:11px;color:#8a8a82;">ID: ${data.id}</p>
  `

  return {
    subject: `[Acervo] Interesse — ${data.piece_title ?? data.name}`,
    html: emailLayout({
      title: 'Novo interesse em obra',
      preheader: `${data.name} demonstrou interesse em ${data.piece_title ?? 'uma obra'}`,
      bodyHtml,
    }),
  }
}

export function interestLeadBuyerEmail(data: Pick<InterestLeadEmailData, 'name' | 'piece_title'>): { subject: string; html: string } {
  const obra = data.piece_title ? ` na obra <em>${data.piece_title}</em>` : ''

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#1a1a18;">Recebemos seu interesse</h1>
    <p style="margin:0 0 16px;">Prezado(a) ${data.name},</p>
    <p style="margin:0 0 16px;">Agradecemos seu contato${obra}. Nossa equipe comercial entrará em contato em breve para compartilhar informações sobre disponibilidade, condições e documentação da peça.</p>
    <p style="margin:0 0 16px;"><strong>Prazo:</strong> retorno em até <strong>2 dias úteis</strong>.</p>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a82;">Próximos passos</p>
    <ol style="margin:0 0 16px;padding-left:20px;color:#3d3d38;">
      <li style="margin-bottom:8px;">Análise da disponibilidade e condições comerciais</li>
      <li style="margin-bottom:8px;">Envio de dossiê com fotos, proveniência e valores</li>
      <li>Agendamento de visita ou viewing room, se desejado</li>
    </ol>
    <p style="margin:0;">Com estima,<br /><span style="font-family:Georgia,serif;">Cabral &amp; Souza</span><br />Galeria de Arte</p>
  `

  return {
    subject: data.piece_title
      ? `Seu interesse em ${data.piece_title} — Cabral & Souza`
      : 'Recebemos seu interesse — Cabral & Souza',
    html: emailLayout({
      title: 'Interesse registrado',
      preheader: 'Nossa equipe entrará em contato em breve',
      bodyHtml,
    }),
  }
}
