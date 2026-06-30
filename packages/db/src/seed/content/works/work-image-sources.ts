/**
 * Imagens de referência para peças placeholder — domínio público (Wikimedia Commons)
 * ou composições estilísticas quando não há obra do artista no Commons (Volpi).
 *
 * Obras substitutas documentadas em `substituteNote`. Watermark aplicado em runtime.
 * Substituir por fotografia profissional pós dia 16.
 */
export type WorkImageSource =
  | {
      type: 'wikimedia'
      url: string
      filename: string
      substituteNote?: string
      licenseNote: string
    }
  | {
      type: 'generated'
      generator: 'volpi-bandeirinhas' | 'volpi-fachada'
      filename: string
      substituteNote: string
    }

export const WORK_IMAGE_SOURCES: Record<string, WorkImageSource> = {
  'CS-2026-0001': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Alegoria_das_Artes%2C_Emiliano_Di_Cavalcanti_%285877905909%29.jpg',
    filename: 'mulata-com-flores.webp',
    substituteNote:
      'Referência: mural Alegoria das Artes (Di Cavalcanti, MASP) — obra substituta em domínio público.',
    licenseNote: 'CC BY-SA 2.0 — Wikimedia Commons',
  },
  'CS-2026-0002': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Alegoria_das_Artes%2C_Emiliano_Di_Cavalcanti_%285877901541%29.jpg',
    filename: 'carnaval-carioca.webp',
    substituteNote:
      'Referência: mural Alegoria das Artes (Di Cavalcanti, MASP) — obra substituta em domínio público.',
    licenseNote: 'CC BY-SA 2.0 — Wikimedia Commons',
  },
  'CS-2026-0003': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Pedro_Am%C3%A9rico_-_Independ%C3%AAncia_ou_Morte_-_Google_Art_Project.jpg',
    filename: 'estudo-para-independencia.webp',
    substituteNote:
      'Referência: Independência ou Morte (Pedro Américo, 1888) — obra em domínio público.',
    licenseNote: 'Domínio público — Google Art Project / Wikimedia Commons',
  },
  'CS-2026-0004': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Alegoria_%282%29_-_Pedro_Am%C3%A9rico.jpg',
    filename: 'retrato-de-damisa.webp',
    substituteNote:
      'Referência: Alegoria (Pedro Américo) — obra substituta em domínio público.',
    licenseNote: 'Domínio público — Wikimedia Commons',
  },
  'CS-2026-0005': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Djanira_-_Painel_Santa_B%C3%A1rbara_MNBA.jpg',
    filename: 'igreja-de-ouro-preto.webp',
    substituteNote:
      'Referência: Painel Santa Bárbara (Djanira, MNBA) — obra substituta em domínio público.',
    licenseNote: 'CC — Wikimedia Commons / MNBA',
  },
  'CS-2026-0006': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Djanira_da_Motta_e_Silva_at_work.jpg',
    filename: 'feira-de-itapua.webp',
    substituteNote:
      'Referência: Djanira em seu ateliê (documento histórico) — substituta; sem pintura de feira no Commons.',
    licenseNote: 'Domínio público — Wikimedia Commons',
  },
  'CS-2026-0007': {
    type: 'generated',
    generator: 'volpi-bandeirinhas',
    filename: 'bandeirinhas-composicao.webp',
    substituteNote:
      'Composição estilística inspirada na série Bandeirinhas — sem reprodução fotográfica de obra específica no Commons.',
  },
  'CS-2026-0008': {
    type: 'generated',
    generator: 'volpi-fachada',
    filename: 'fachada-em-verde.webp',
    substituteNote:
      'Composição estilística inspirada nas fachadas de Volpi — sem reprodução fotográfica de obra específica no Commons.',
  },
  'CS-2026-0009': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Escultura_na_Pra%C3%A7a_da_S%C3%A9%2C_S%C3%A9rgio_de_Camargo_%285877582091%29.jpg',
    filename: 'relevo-em-madeira-serie-branca.webp',
    substituteNote:
      'Referência: escultura de Sérgio Camargo, Praça da Sé (SP) — obra substituta em domínio público.',
    licenseNote: 'CC BY-SA 2.0 — Wikimedia Commons',
  },
  'CS-2026-0010': {
    type: 'wikimedia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Escultura_na_Pra%C3%A7a_da_S%C3%A9%2C_S%C3%A9rgio_de_Camargo_%285878148376%29.jpg',
    filename: 'relevo-untitled.webp',
    substituteNote:
      'Referência: escultura de Sérgio Camargo, Praça da Sé (SP) — obra substituta em domínio público.',
    licenseNote: 'CC BY-SA 2.0 — Wikimedia Commons',
  },
}

export const WORK_IMAGE_STORAGE_PREFIX = 'works'
