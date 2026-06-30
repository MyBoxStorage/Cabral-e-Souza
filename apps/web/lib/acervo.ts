export const ACERVO_PAGE_SIZE = 24

export const PIECE_CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'pintura', label: 'Pintura' },
  { value: 'escultura', label: 'Escultura' },
  { value: 'desenho', label: 'Desenho' },
  { value: 'gravura', label: 'Gravura' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'objeto', label: 'Objeto' },
  { value: 'antiguidade', label: 'Antiguidade' },
] as const

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PIECE_CATEGORIES.filter((c) => c.value).map((c) => [c.value, c.label]),
)

export type AcervoSearchParams = {
  artista?: string | undefined
  categoria?: string | undefined
  busca?: string | undefined
  pagina?: string | undefined
}

export function buildAcervoQuery(
  current: AcervoSearchParams,
  patch: Partial<AcervoSearchParams> & { clearPagina?: boolean },
): string {
  const merged = { ...current, ...patch }
  if (patch.clearPagina || patch.categoria !== undefined || patch.artista !== undefined || patch.busca !== undefined) {
    delete merged.pagina
  }

  const params = new URLSearchParams()
  if (merged.artista) params.set('artista', merged.artista)
  if (merged.categoria) params.set('categoria', merged.categoria)
  if (merged.busca) params.set('busca', merged.busca)
  if (merged.pagina && merged.pagina !== '1') params.set('pagina', merged.pagina)

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function hasActiveFilters(params: AcervoSearchParams): boolean {
  return Boolean(params.artista || params.categoria || params.busca)
}
