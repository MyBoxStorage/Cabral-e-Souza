/**
 * Imagens de domínio público baixadas do Wikimedia em 2026-06-30.
 * Substituir por fotos editoriais profissionais quando disponíveis.
 *
 * URLs antigas (thumb/800px) retornavam 400 — Wikimedia exige tamanhos válidos
 * ou arquivo original. Fontes verificadas via Commons/Wikipedia API.
 */
export const ARTIST_PORTRAIT_SOURCES: Record<
  string,
  { url: string; filename: string; note?: string }
> = {
  'di-cavalcanti': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Di_Cavalcanti%2C_1964_-_restored_%28cropped%29.tif',
    filename: 'di-cavalcanti.webp',
    note: 'Retrato 1964 (domínio público) — convertido de TIFF',
  },
  'pedro-americo': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Pedro_Am%C3%A9rico%2C_ca%2C_1899.jpg',
    filename: 'pedro-americo.webp',
  },
  djanira: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Djanira_da_Motta_e_Silva_at_work.jpg',
    filename: 'djanira.webp',
  },
  'alfredo-volpi': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Concretistas_na_Galeria_das_%22Folhas%22_-_Volpi_e_Zanini.jpg',
    filename: 'alfredo-volpi.webp',
    note: 'Volpi à esquerda — melhor retrato disponível no Commons',
  },
  'sergio-camargo': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/6427_Sergio_Camargo.jpg',
    filename: 'sergio-camargo.webp',
  },
}

export const ARTIST_PORTRAIT_STORAGE_PREFIX = 'artist-portraits'
