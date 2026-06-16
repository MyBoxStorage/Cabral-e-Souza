import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PieceCard } from '../../../../components/artwork/PieceCard'
import { getPublicPieces } from '../../../../lib/queries/pieces'

export const revalidate = 3600

interface AcervoPageProps {
  searchParams: Promise<{
    artista?: string
    categoria?: string
    busca?: string
    pagina?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Acervo',
    description:
      'Obras de Di Cavalcanti, Alfredo Volpi, Djanira, Sergio Camargo e outros mestres da arte brasileira moderna e contemporânea. Autenticidade garantida.',
  }
}

const CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'pintura', label: 'Pintura' },
  { value: 'escultura', label: 'Escultura' },
  { value: 'desenho', label: 'Desenho' },
  { value: 'gravura', label: 'Gravura' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'objeto', label: 'Objeto' },
  { value: 'antiguidade', label: 'Antiguidade' },
]

export default async function AcervoPage({ searchParams }: AcervoPageProps) {
  const params = await searchParams
  const t = await getTranslations('nav')

  const pieces = await getPublicPieces({
    ...(params.artista ? { artistSlug: params.artista } : {}),
    ...(params.categoria ? { category: params.categoria as 'pintura' | 'escultura' | 'desenho' | 'gravura' | 'fotografia' | 'objeto' | 'antiguidade' } : {}),
    ...(params.busca ? { search: params.busca } : {}),
    limit: 48,
  })

  const activeCategory = params.categoria ?? ''

  return (
    <>
      {/* Cabeçalho */}
      <section className="bg-[--color-paper-muted] border-b border-[--color-paper-deep] py-12 md:py-16">
        <div className="container-default">
          <p className="label-caps text-[--color-accent] mb-4">{t('acervo')}</p>
          <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-light tracking-[-0.02em]">
            Acervo
          </h1>
          <p className="font-body text-[--color-ink-muted] mt-3 max-w-[56ch]">
            Arte moderna e contemporânea brasileira selecionada com rigor histórico e estético.
            Todas as obras acompanham certificado de autenticidade.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="border-b border-[--color-paper-deep] py-4">
        <div className="container-default">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar" role="navigation" aria-label="Filtrar por categoria">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.value}
                href={cat.value ? `/acervo?categoria=${cat.value}` : '/acervo'}
                className={[
                  'flex-shrink-0 font-body text-[11px] uppercase tracking-[0.1em] px-4 py-2 border transition-colors duration-200',
                  activeCategory === cat.value
                    ? 'border-[--color-ink] bg-[--color-ink] text-[--color-paper]'
                    : 'border-[--color-paper-deep] text-[--color-ink-muted] hover:border-[--color-ink] hover:text-[--color-ink]',
                ].join(' ')}
                aria-current={activeCategory === cat.value ? 'page' : undefined}
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16">
        <div className="container-default">
          {pieces.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-[1.5rem] font-light text-[--color-ink-subtle] mb-4">
                Nenhuma obra disponível no momento
              </p>
              <p className="font-body text-[13px] text-[--color-ink-subtle] max-w-[40ch] mx-auto">
                Nosso acervo é renovado continuamente. Entre em contato para saber sobre obras disponíveis.
              </p>
              <a
                href="/contato"
                className="inline-block mt-8 font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-8 py-4 transition-colors duration-200"
              >
                Consultar
              </a>
            </div>
          ) : (
            <>
              <p className="font-body text-[12px] text-[--color-ink-subtle] mb-8">
                {pieces.length} {pieces.length === 1 ? 'obra' : 'obras'}
                {params.categoria ? ` em ${params.categoria}` : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {pieces.map((piece, i) => (
                  <PieceCard key={piece.id} piece={piece} priority={i < 4} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
