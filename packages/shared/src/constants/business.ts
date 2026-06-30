/**
 * Dados institucionais — single source of truth.
 * TODO(socios): Confirmar todos os valores — ver docs/PENDENCIAS_SOCIOS.md
 */

export const SITE_URL_DEFAULT = 'https://cabralesouza.com.br'

const ADDRESS = {
  street: 'Rua Siqueira Campos, 143 — Sl. 63',
  neighborhood: 'Copacabana',
  city: 'Rio de Janeiro',
  state: 'RJ',
  zip: '22041-001',
  country: 'Brasil',
} as const

export const BUSINESS = {
  name: 'Cabral & Souza',
  legalName: 'Cabral & Souza Antiguidades Ltda',
  tagline: 'Galeria de Arte',

  /** TODO(socios): Confirmar endereço oficial da galeria */
  address: ADDRESS,

  addressFormatted: `${ADDRESS.street}, ${ADDRESS.neighborhood} · ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`,

  addressMultiline: `${ADDRESS.street}\n${ADDRESS.neighborhood} · ${ADDRESS.city} — ${ADDRESS.state}\nCEP ${ADDRESS.zip}`,

  /** TODO(socios): Confirmar email institucional monitorado */
  email: 'contato@cabralesouza.com.br',

  /** TODO(socios): Confirmar email LGPD se diferente do institucional */
  privacyEmail: 'privacidade@cabralesouza.com.br',

  /** TODO(socios): Confirmar número oficial WhatsApp da galeria */
  phone: {
    whatsappE164: '5521970027830',
    whatsappDisplay: '(21) 97002-7830',
    /** Admin only — exibir "a confirmar" até decisão dos sócios */
    adminLabel: 'a confirmar',
  },

  /** TODO(socios): Confirmar horário e política de visitas */
  hours: 'Seg–Sex 10h–18h · Sáb 10h–14h',
  hoursDetail: 'Domingo e feriados: fechado. Visitas mediante agendamento.',

  /** TODO(socios): Confirmar handles e URLs ativas */
  social: {
    instagram: 'https://instagram.com/cabralesouza',
    instagramHandle: '@cabralesouza',
  },

  /** TODO(socios): Confirmar filiação CNART/IPHAN antes de exibir no footer */
  cnartMember: false,

  /**
   * i18n visível ao usuário — ver ADR 004.
   * Infraestrutura (/en-US, /fr-FR) permanece; UI oculta até tradução.
   */
  i18nPublicEnabled: false,

  foundedYear: 1987,
} as const

/** URL wa.me com mensagem opcional */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${BUSINESS.phone.whatsappE164}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
