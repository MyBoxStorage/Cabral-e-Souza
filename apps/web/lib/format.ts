/** Formata valor em BRL. Ex: 45000 → "R$ 45.000" */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Intervalo de anos de um artista. Ex: "(1897–1976)" */
export function artistYears(birth?: number | null, death?: number | null): string {
  if (!birth) return ''
  return death ? `(${birth}–${death})` : `(n. ${birth})`
}

/** Dimensões formatadas. Ex: "120 × 85 cm" */
export function formatDimensions(h?: number | null, w?: number | null, d?: number | null): string {
  if (!h && !w) return ''
  const parts = [h, w, d].filter((v): v is number => v != null)
  return parts.join(' × ') + ' cm'
}

/** Ano de criação com indicador de circa. Ex: "c. 1950" */
export function formatYear(year?: number | null, circa?: boolean | null): string {
  if (!year) return ''
  return circa ? `c. ${year}` : String(year)
}

/** Trunca texto preservando palavras completas */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}
