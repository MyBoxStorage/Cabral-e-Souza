import crypto from 'crypto'

/** Hash sha256 de um texto (usado como cache key de tradução) */
export function contentHash(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex')
}

/** Formata valor em BRL (sem cents se for inteiro) */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Slug seguro: lowercase, sem acentos, hífen */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
