import type { Database } from '../types'
import { PLACEHOLDER_MARKER } from './utils'

type PieceInsert = Omit<Database['public']['Tables']['pieces']['Insert'], 'artist_id'> & {
  artistSlug: string
}

export const PLACEHOLDER_PIECES: PieceInsert[] = [
  {
    artistSlug: 'di-cavalcanti',
    internal_code: 'CS-2026-0001',
    slug: 'mulata-com-flores',
    title_pt: 'Mulata com Flores',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Óleo sobre tela',
    height_cm: 81,
    width_cm: 65,
    year_created: 1964,
    is_signed: true,
    signature_location: 'Canto inferior direito',
    description_pt: `Esta tela de 1964 exemplifica a maturidade plástica de Emiliano Di Cavalcanti na representação da figura feminina carioca — tema que percorreu toda a sua trajetória desde os anos 1920. A composição articula o busto de uma mulata em três quartos, envolta por um bouquet de flores tropicais que funcionam simultaneamente como ornamento e como elemento estruturante do quadro.

A paleta revela o domínio cromático que consolidou a reputação do artista: amarelos-ouro, vermelhos profundos e verdes esmeralda dispõem-se em planos que remetem à tradição cubista, mas sem jamais abdicar da sensualidade e do ritmo que caracterizam sua poética. As pinceladas são seguras, de contorno definido, com modelagem volumétrica que dialoga com a escola de Cézanne — referência declarada pelo pintor ao longo da carreira.

O fundo, tratado em tons terrosos e ocres, cria um contraste que realça a figura central, conferindo à obra a intensidade luminosa típica do período pós-guerra do artista. Trata-se de uma pintura que sintetiza os interesses permanentes de Di Cavalcanti: a celebração da cultura afro-brasileira, a modernidade formal e a afirmação de uma estética genuinamente nacional, livre dos academicismos que ainda persistiam no cenário artístico brasileiro da década de 1960.`,
    provenance_pt:
      'Adquirida em coleção particular do Rio de Janeiro, com certificado de autenticidade emitido pelo Instituto Di Cavalcanti.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 15000,
    price_visibility: 'publico',
    origin: 'propria',
    status: 'publico',
    featured: true,
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'di-cavalcanti',
    internal_code: 'CS-2026-0002',
    slug: 'carnaval-carioca',
    title_pt: 'Carnaval Carioca',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Óleo sobre tela',
    height_cm: 60,
    width_cm: 81,
    year_created: 1958,
    is_signed: true,
    signature_location: 'Canto inferior esquerdo',
    description_pt: `Pintura de 1958 que captura a efervescência do carnaval carioca com a verve narrativa e cromática que define a obra madura de Di Cavalcanti. A composição horizontal reúne figuras dançantes, instrumentos musicais e elementos do folclore urbano carioca em uma cena densa, quase cinematográfica, onde múltiplos planos de ação coexistem harmoniosamente.

O artista emprega aqui sua técnica característica de contornos firmes e cores saturadas, criando um mosaico visual que evoca simultaneamente a tradição das gravuras de carnaval e a modernidade da pintura brasileira. Os personagens — mulatas, malandros, músicos — são tratados com dignidade e exuberância, sem cair no folclorismo simplista que o artista sempre rejeitou em sua produção.

A obra dialoga diretamente com o legado da Semana de 1922, quando Di Cavalcanti proclamou a necessidade de uma arte brasileira autêntica, enraizada na cultura popular mas formulada com rigor modernista. Nesta tela, quatro décadas depois, o pintor demonstra que manteve fidelidade a esse programa estético, refinando sua linguagem sem perder a vitalidade que o tornou um dos nomes centrais do modernismo brasileiro.`,
    provenance_pt:
      'Proveniente de coleção particular de São Paulo, com laudo de autenticidade do Instituto Di Cavalcanti.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 45000,
    price_visibility: 'sob_consulta',
    origin: 'consignada',
    status: 'publico',
    featured: false,
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'pedro-americo',
    internal_code: 'CS-2026-0003',
    slug: 'estudo-para-independencia',
    title_pt: 'Estudo para Independência ou Morte',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Óleo sobre tela',
    height_cm: 46,
    width_cm: 38,
    year_created: 1887,
    is_signed: true,
    signature_location: 'Verso da tela',
    description_pt: `Estudo preparatório para a monumental tela "Independência ou Morte" (1888), obra magna de Pedro Américo e um dos ícones da pintura histórica brasileira. Executado em 1887, durante a fase final de preparação da obra definitiva — hoje no Museu Paulista do Ipiranga —, este painel revela o processo criativo do artista na elaboração da composição que imortalizou o Grito do Ipiranga.

O estudo concentra-se na figura central de Dom Pedro I a cavalo, com a espada erguida, rodeado por figuras secundárias que seriam posteriormente desenvolvidas em escala monumental na versão final. A pincelada é mais solta e expeditiva que na obra acabada, permitindo vislumbrar as decisões compositivas e cromáticas que Pedro Américo foi refinando ao longo de meses de trabalho intenso em seu ateliê fluminense.

A importância histórica deste estudo transcende seu valor artístico: documenta o momento em que a narrativa visual da independência brasileira estava sendo forjada por um dos maiores pintores acadêmicos do século XIX nas Américas. Pedro Américo, formado na École des Beaux-Arts de Paris e agraciado com comendas europeias, aplicou toda sua erudição histórica e técnica à criação de uma imagem que se tornaria fundacional para a identidade visual do Brasil republicano.`,
    provenance_pt:
      'Adquirida em coleção particular do Nordeste brasileiro, com documentação de proveniência e parecer de especialista em arte do século XIX.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 120000,
    price_visibility: 'sob_consulta',
    origin: 'propria',
    status: 'reservado',
    featured: true,
    iphan_restricted: true,
    iphan_notes: 'Obra produzida antes de 1889 — sujeita à Lei 4.845/1965 (Período Monárquico). Exportação condicionada à autorização do IPHAN.',
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'pedro-americo',
    internal_code: 'CS-2026-0004',
    slug: 'retrato-de-damisa',
    title_pt: 'Retrato de Damisa',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Óleo sobre tela',
    height_cm: 73,
    width_cm: 60,
    year_created: 1870,
    is_signed: true,
    signature_location: 'Canto inferior direito',
    description_pt: `Retrato executado em 1870, período em que Pedro Américo consolidava sua reputação como retratista de elite no Brasil imperial. A obra representa Damisa, figura de destaque na corte, em pose formal com vestimentas da moda parisiense da época, evidenciando o domínio do artista sobre a técnica acadêmica de modelagem e o tratamento de tecidos e adereços.

A composição segue os cânones do retrato oficial do século XIX: figura em três quartos, fundo neutro que realça a presença do retratado, iluminação que modela o rosto com suavidade acadêmica. Pedro Américo demonstra aqui a formação recebida em Paris sob orientação de mestres como Victor Mottez e Hippolyte Flandrin, adaptando os preceitos europeus a um contexto brasileiro sem perder a especificidade local.

O valor desta obra reside tanto em sua qualidade pictórica quanto em sua função documental: retratos deste período são testemunhos visuais da elite imperial brasileira, registrando trajes, gestos e convenções sociais de uma era que a pintura histórica de Pedro Américo ajudaria a encerrar simbolicamente com a proclamação da República.`,
    provenance_pt:
      'Coleção familiar do interior paulista, com certificado de autenticidade e registro em catálogo de obras do artista.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 85000,
    price_visibility: 'sob_consulta',
    origin: 'consignada',
    status: 'publico',
    featured: false,
    iphan_restricted: true,
    iphan_notes: 'Obra produzida antes de 1889 — sujeita à Lei 4.845/1965.',
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'djanira',
    internal_code: 'CS-2026-0005',
    slug: 'igreja-de-ouro-preto',
    title_pt: 'Igreja de Ouro Preto',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Óleo sobre tela',
    height_cm: 50,
    width_cm: 61,
    year_created: 1962,
    is_signed: true,
    signature_location: 'Canto inferior direito',
    description_pt: `Pintura de 1962 que registra com sensibilidade ímpar a arquitetura barroca de Ouro Preto, cidade que Djanira visitou repetidamente e que se tornou fonte inesgotável de inspiração em sua produção. A igreja, representada em perspectiva frontal com torres simétricas, emerge de um fundo de céu azul intenso que contrasta com as tonalidades terrosas e ocres da fachada em pedra.

A técnica de Djanira — direta, sem pretensões acadêmicas, com contornos definidos e cores planas — confere à cena uma qualidade quase iconográfica, como se a igreja fosse um ícone religioso inserido na paisagem mineira. Essa simplicidade formal, longe de ser ingênua, revela um olhar treinado pela observação paciente do cotidiano brasileiro e pela convicção de que a grandeza artística pode residir na representação honesta do mundo visível.

A obra integra o conjunto de pinturas que Djanira dedicou ao patrimônio arquitetônico e religioso do Brasil, temática que a coloca em diálogo com a tradição da pintura popular e que antecipa, em certa medida, o interesse contemporâneo pela arte brasileira de raiz. Sua paleta vibrante e sua composição equilibrada tornam esta tela um exemplar representativo da maturidade artística da pintora.`,
    provenance_pt:
      'Adquirida em coleção particular de Belo Horizonte, com laudo emitido por especialista em arte popular brasileira.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 12000,
    price_visibility: 'publico',
    origin: 'propria',
    status: 'publico',
    featured: false,
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'djanira',
    internal_code: 'CS-2026-0006',
    slug: 'feira-de-itapua',
    title_pt: 'Feira de Itapuã',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Óleo sobre tela',
    height_cm: 55,
    width_cm: 46,
    year_created: 1968,
    is_signed: true,
    signature_location: 'Canto inferior esquerdo',
    description_pt: `Tela de 1968 que documenta a feira de Itapuã, bairro de Salvador onde Djanira residiu e pintou algumas de suas obras mais memoráveis. A composição reúne vendedores, compradores e mercadorias em uma cena densa e colorida que captura o ritmo e a diversidade do comércio popular baiano.

As figuras humanas, tratadas com o traço característico da artista — simplificado mas expressivo — ocupam o primeiro plano em atitudes de negociação e convívio. Ao fundo, elementos da arquitetura local e da vegetação tropical situam a cena geograficamente, enquanto a paleta quente de amarelos, vermelhos e azuis evoca a luminosidade característica do litoral nordestino.

Esta obra exemplifica o compromisso de Djanira com a representação do Brasil real — não o Brasil imaginado pelos modernistas urbanos, mas o Brasil das feiras, das festas religiosas, do trabalho cotidiano. Sua pintura, frequentemente classificada como naïf ou popular, transcende essas categorias pela consistência de sua visão e pela sofisticação cromática que desenvolveu ao longo de décadas de produção ininterrupta.`,
    provenance_pt:
      'Proveniente de coleção particular do Rio de Janeiro, com certificado de autenticidade.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 18000,
    price_visibility: 'publico',
    origin: 'propria',
    status: 'publico',
    featured: false,
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'alfredo-volpi',
    internal_code: 'CS-2026-0007',
    slug: 'bandeirinhas-composicao',
    title_pt: 'Bandeirinhas',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Têmpera sobre tela',
    height_cm: 65,
    width_cm: 81,
    year_created: 1972,
    is_signed: true,
    signature_location: 'Verso da tela',
    description_pt: `Composição de 1972 pertencente à série das "Bandeirinhas" — tema que consagrou Alfredo Volpi internacionalmente e que sintetiza sua trajetória desde a representação figurativa até a abstração geométrica. A obra dispõe faixas coloridas em ritmo vertical, evocando as bandeiras de festas juninas que o artista observava na infância em Itália e que reencontrou no Brasil.

A têmpera, técnica que Volpi dominou com maestria incomparável, confere à superfície uma qualidade mate e uma profundidade cromática que o óleo jamais lhe proporcionaria. Cada faixa de cor é aplicada com precisão caligráfica, criando um equilíbrio entre ordem geométrica e liberdade expressiva que define a singularidade de sua obra.

As "Bandeirinhas" de Volpi transcendem a mera referência folclórica: são composições abstratas de rigor construtivista, comparáveis às melhores produções da arte concreta internacional, mas com uma paleta e uma sensibilidade inconfundivelmente brasileiras. Esta tela, executada na plenitude de sua carreira, demonstra a coerência de um artista que manteve fidelidade a sua visão ao longo de mais de cinco décadas de produção.`,
    provenance_pt:
      'Adquirida em coleção particular de São Paulo, com certificado emitido pelo Instituto Alfredo Volpi de Arte Moderna.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 95000,
    price_visibility: 'sob_consulta',
    origin: 'propria',
    status: 'publico',
    featured: true,
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'alfredo-volpi',
    internal_code: 'CS-2026-0008',
    slug: 'fachada-em-verde',
    title_pt: 'Fachada em Verde',
    attribution: 'autoria_confirmada',
    category: 'pintura',
    technique_pt: 'Têmpera sobre tela',
    height_cm: 46,
    width_cm: 33,
    year_created: 1965,
    is_signed: true,
    signature_location: 'Verso da tela',
    description_pt: `Pintura de 1965 integrante da série de fachadas que Volpi desenvolveu entre os anos 1950 e 1970, antes e durante a consolidação das "Bandeirinhas". A obra representa a fachada de um edifício em tons predominantemente verdes, com janelas e portas geometrizadas que antecipam a abstração plena de sua fase madura.

A composição vertical, organizada em planos sobrepostos de cor, revela a transição gradual de Volpi do figurativismo ao construtivismo. As fachadas, observadas nos bairros operários de São Paulo onde o artista viveu a maior parte da vida, são reduzidas a suas essências geométricas e cromáticas, mantendo ainda legíveis os elementos arquitetônicos que as identificam.

Esta tela ocupa um lugar privilegiado na compreensão da evolução estética de Volpi: ela documenta o momento em que o artista abandonava definitivamente a representação narrativa em favor de uma pintura puramente visual, baseada na relação entre cor, forma e ritmo. A têmpera, aplicada em camadas finas sobre tela preparada, confere à superfície a qualidade sedosa que tornou suas obras tão cobiçadas no mercado internacional.`,
    provenance_pt:
      'Coleção particular do interior paulista, com laudo do Instituto Alfredo Volpi de Arte Moderna.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 35000,
    price_visibility: 'sob_consulta',
    origin: 'consignada',
    status: 'publico',
    featured: false,
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'sergio-camargo',
    internal_code: 'CS-2026-0009',
    slug: 'relevo-em-madeira-serie-branca',
    title_pt: 'Relevo em Madeira (série branca)',
    attribution: 'autoria_confirmada',
    category: 'escultura',
    technique_pt: 'Relevo em madeira pintada',
    height_cm: 80,
    width_cm: 80,
    depth_cm: 8,
    year_created: 1975,
    is_signed: false,
    description_pt: `Relevo em madeira de 1975 pertencente à série branca que Sergio Camargo desenvolveu após seu retorno definitivo ao Brasil, vindos de Paris e Londres. A obra consiste em cilindros de madeira dispostos em profundidade variável sobre um painel, criando um jogo de luz e sombra que transforma a superfície plana em um campo escultórico dinâmico.

A madeira, pintada de branco, absorve e reflete a luz de maneira diferente conforme o ângulo de visão e a iluminação ambiente, conferindo à obra uma qualidade quase cinética sem que qualquer elemento se mova. Esta dialética entre estático e dinâmico, entre superfície e profundidade, é o cerne da poética de Camargo e o que o distingue de outros artistas construtivistas de sua geração.

Formado na oficina de Bruno Giorgi e influenciado por sua convivência com Jean Arp e o grupo ZERO em Paris, Camargo desenvolveu uma linguagem escultórica que dialoga com o construtivismo europeu mas que possui identidade própria, enraizada na tradição da madeira entalhada brasileira. Esta obra, de escala média, exemplifica a maturidade de sua produção nos anos 1970, quando sua reputação internacional já estava consolidada.`,
    provenance_pt:
      'Adquirida em coleção particular do Rio de Janeiro, com certificado de autenticidade da Fundação Sergio Camargo.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 280000,
    price_visibility: 'sob_consulta',
    origin: 'propria',
    status: 'publico',
    featured: false,
    published_at: new Date().toISOString(),
  },
  {
    artistSlug: 'sergio-camargo',
    internal_code: 'CS-2026-0010',
    slug: 'relevo-untitled',
    title_pt: 'Untitled (Relief)',
    attribution: 'autoria_confirmada',
    category: 'escultura',
    technique_pt: 'Relevo em mármore de Carrara',
    height_cm: 60,
    width_cm: 60,
    depth_cm: 6,
    year_created: 1982,
    is_signed: false,
    description_pt: `Relevo em mármore de Carrara executado em 1982, período em que Sergio Camargo expandiu sua prática escultórica para além da madeira, explorando a textura e a luminosidade de materiais nobres. A obra dispõe elementos cilíndricos em mármore branco sobre um painel de mesmo material, criando uma superfície de profundidade variável que responde de maneira singular à iluminação natural.

O mármore, material associado à tradição escultórica clássica, é aqui subvertido: em vez de figuração, Camargo emprega o material nobre para uma composição abstrata de caráter construtivista. A escolha do mármore de Carrara — o mesmo utilizado por Michelangelo — revela a ambição do artista de dialogar com a história da escultura ocidental enquanto a renova com sua gramática formal inovadora.

Esta obra documenta a versatilidade de Camargo nos anos finais de sua carreira, quando sua produção em mármore e bronze complementava a série de relevos em madeira que o havia consagrado. A escala contida e a pureza cromática tornam esta peça particularmente adequada a ambientes de coleção que privilegiam a intimidade e a contemplação.`,
    provenance_pt:
      'Proveniente de coleção particular de São Paulo, com documentação da Fundação Sergio Camargo.',
    curator_notes_pt: PLACEHOLDER_MARKER,
    price_brl: 75000,
    price_visibility: 'sob_consulta',
    origin: 'consignada',
    status: 'reservado',
    featured: false,
    published_at: new Date().toISOString(),
  },
]
