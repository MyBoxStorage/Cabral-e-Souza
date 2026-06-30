export type CollectionSeed = {
  slug: string
  title_pt: string
  description_pt: string
  sort_order: number
  is_dynamic?: boolean
  dynamic_kind?: 'novidades' | 'sob_consulta'
  pieceSlugs?: string[]
}

export const COLLECTION_SEEDS: CollectionSeed[] = [
  {
    slug: 'modernismo-brasileiro',
    title_pt: 'Modernismo Brasileiro',
    description_pt:
      'Volpi, Di Cavalcanti, Djanira e outros nomes centrais da modernidade brasileira — obras selecionadas por rigor formal e importância histórica.',
    sort_order: 1,
    pieceSlugs: [
      'bandeirinhas-composicao',
      'fachada-em-verde',
      'mulata-com-flores',
      'carnaval-carioca',
      'igreja-de-ouro-preto',
      'feira-de-itapua',
    ],
  },
  {
    slug: 'belle-epoque',
    title_pt: 'Belle Époque',
    description_pt:
      'Obras do século XIX europeu e acadêmico — retratos, pintura histórica e refinamento técnico da tradição ocidental.',
    sort_order: 2,
    pieceSlugs: ['retrato-de-damisa'],
  },
  {
    slug: 'esculturas-em-bronze',
    title_pt: 'Esculturas em Bronze',
    description_pt:
      'Relevos e esculturas de Sergio Camargo e mestres do volume — construção, luz e matéria em diálogo com o modernismo.',
    sort_order: 3,
    pieceSlugs: ['relevo-em-madeira-serie-branca', 'relevo-untitled'],
  },
  {
    slug: 'seculo-xix-brasileiro',
    title_pt: 'Século XIX Brasileiro',
    description_pt:
      'Pedro Américo e a pintura histórica imperial — documentos visuais da formação da identidade artística nacional.',
    sort_order: 4,
    pieceSlugs: ['estudo-para-independencia', 'retrato-de-damisa'],
  },
  {
    slug: 'arte-sacra',
    title_pt: 'Arte Sacra',
    description_pt:
      'Peças religiosas históricas e arquitetura sacra na pintura brasileira — devoção, patrimônio e memória visual.',
    sort_order: 5,
    pieceSlugs: ['igreja-de-ouro-preto'],
  },
  {
    slug: 'novidades-do-mes',
    title_pt: 'Novidades do Mês',
    description_pt:
      'Obras recém-incorporadas ao acervo — seleção atualizada com as últimas aquisições e consignações da galeria.',
    sort_order: 6,
    is_dynamic: true,
    dynamic_kind: 'novidades',
  },
  {
    slug: 'sob-consulta',
    title_pt: 'Sob Consulta',
    description_pt:
      'Peças premium de alto valor — disponíveis mediante consulta personalizada com nossa equipe curatorial.',
    sort_order: 7,
    is_dynamic: true,
    dynamic_kind: 'sob_consulta',
  },
]
