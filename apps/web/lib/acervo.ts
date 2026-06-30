export const ACERVO_PAGE_SIZE = 24

export const PIECE_CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'pintura', label: 'Pintura' },
  { value: 'escultura', label: 'Escultura' },
  { value: 'desenho', label: 'Desenho' },
  { value: 'gravura', label: 'Gravura' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'objeto', label: 'Objeto' },
  { value: 'antiguidade', label: 'Antiguidade' },
] as const

export const ACERVO_SORT_OPTIONS = [
  { value: 'recente', label: 'Mais recente' },
  { value: 'artista', label: 'Por artista' },
  { value: 'valor', label: 'Por valor' },
] as const

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PIECE_CATEGORIES.filter((c) => c.value).map((c) => [c.value, c.label]),
)

export type AcervoSearchParams = {
  artista?: string | undefined
  categoria?: string | undefined
  busca?: string | undefined
  pagina?: string | undefined
  colecao?: string | undefined
  ordenar?: string | undefined
}

export function buildAcervoQuery(
  current: AcervoSearchParams,
  patch: Partial<AcervoSearchParams> & { clearPagina?: boolean },
): string {
  const merged = { ...current, ...patch }
  if (
    patch.clearPagina ||
    patch.categoria !== undefined ||
    patch.artista !== undefined ||
    patch.busca !== undefined ||
    patch.colecao !== undefined ||
    patch.ordenar !== undefined
  ) {
    delete merged.pagina
  }

  const params = new URLSearchParams()
  if (merged.colecao) params.set('colecao', merged.colecao)
  if (merged.artista) params.set('artista', merged.artista)
  if (merged.categoria) params.set('categoria', merged.categoria)
  if (merged.busca) params.set('busca', merged.busca)
  if (merged.ordenar && merged.ordenar !== 'recente') params.set('ordenar', merged.ordenar)
  if (merged.pagina && merged.pagina !== '1') params.set('pagina', merged.pagina)

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function hasActiveFilters(params: AcervoSearchParams): boolean {
  return Boolean(params.artista || params.categoria || params.busca || params.colecao)
}
