export interface EmailLayoutOptions {
  title: string
  preheader?: string
  bodyHtml: string
}

export function emailLayout({ title, preheader, bodyHtml }: EmailLayoutOptions): string {
  const preheaderBlock = preheader
    ? `<span style="display:none;font-size:1px;color:#fafaf7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>`
    : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f4ef;font-family:Georgia,'Times New Roman',serif;color:#1a1a18;">
  ${preheaderBlock}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f4ef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fafaf7;border:1px solid #e8e6df;">
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid #e8e6df;">
              <p style="margin:0;font-family:Georgia,serif;font-size:20px;font-weight:400;letter-spacing:-0.02em;color:#1a1a18;">Cabral &amp; Souza</p>
              <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#8b7355;">Galeria de Arte</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#3d3d38;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #e8e6df;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#8a8a82;">
              Cabral &amp; Souza · Galeria de Arte<br />
              São Paulo · Rio de Janeiro<br />
              <a href="https://cabralesouza.com.br" style="color:#8b7355;text-decoration:none;">cabralesouza.com.br</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function whatsAppLink(phone: string | null | undefined, message?: string): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const normalized = digits.startsWith('55') ? digits : `55${digits}`
  const base = `https://wa.me/${normalized}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

const TECHNIQUE_LABELS: Record<string, string> = {
  pintura: 'Pintura',
  escultura: 'Escultura',
  desenho: 'Desenho',
  gravura: 'Gravura',
  fotografia: 'Fotografia',
  objeto: 'Objeto',
  antiguidade: 'Antiguidade',
}

export function techniqueLabel(value: string | null | undefined): string {
  if (!value) return '—'
  return TECHNIQUE_LABELS[value] ?? value
}

export function valueRangeLabel(notes: string | null | undefined): string {
  if (!notes) return '—'
  if (notes.includes('ate_20k')) return 'Até R$ 20 mil'
  if (notes.includes('20_80k')) return 'R$ 20 mil – R$ 80 mil'
  if (notes.includes('80_300k')) return 'R$ 80 mil – R$ 300 mil'
  if (notes.includes('300k_mais')) return 'Acima de R$ 300 mil'
  if (notes.includes('nao_sei')) return 'Não informado'
  return notes.replace('Faixa expectativa: ', '')
}
