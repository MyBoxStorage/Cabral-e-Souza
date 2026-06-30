import type { Metadata } from 'next'
import { PageHeader } from '@cabral-souza/ui'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { AcervoFilters } from '../../../../components/artwork/AcervoFilters'
import { AcervoPagination } from '../../../../components/artwork/AcervoPagination'
import { CollectionCard } from '../../../../components/artwork/CollectionCard'
import { PieceArtworkCard } from '../../../../components/artwork/PieceArtworkCard'
import { Reveal } from '../../../../components/ui/Reveal'
import { JsonLd } from '../../../../components/seo/JsonLd'
import {
  ACERVO_PAGE_SIZE,
  CATEGORY_LABELS,
  hasActiveFilters,
  type AcervoSearchParams,
} from '../../../../lib/acervo'
import { getPublishedArtists } from '../../../../lib/queries/artists'
import {
  countCollectionPiecesBySlug,
  getCollectionBySlug,
  getPiecesByCollectionSlug,
  getPublishedCollections,
} from '../../../../lib/queries/collections'
import { countPublicPieces, getPublicPieces } from '../../../../lib/queries/pieces'
import { buildPageMetadata, getSiteUrl } from '../../../../lib/seo/metadata'
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from '../../../../lib/seo/schema'

export const revalidate = 3600

interface AcervoPageProps {
  searchParams: Promise<AcervoSearchParams>
}

export async function generateMetadata({ searchParams }: AcervoPageProps): Promise<Metadata> {
  const params = await searchParams
  if (params.colecao) {
    const collection = await getCollectionBySlug(params.colecao)
    if (collection) {
      return buildPageMetadata({
        title: collection.title_pt,
        description: collection.description_pt,
        path: `/acervo?colecao=${collection.slug}`,
      })
    }
  }
  return buildPageMetadata({
    title: 'Acervo Cabral & Souza',
    description:
      'Coleções curatoriais de arte moderna brasileira, escultura e antiguidades selecionadas com rigor histórico e estético.',
    path: '/acervo',
  })
}

export default async function AcervoPage({ searchParams }: AcervoPageProps) {
  const params = await searchParams
  const locale = await getLocale()
  const page = Math.max(1, parseInt(params.pagina ?? '1', 10) || 1)
  const offset = (page - 1) * ACERVO_PAGE_SIZE
  const sort = (params.ordenar as 'recente' | 'artista' | 'valor' | undefined) ?? 'recente'

  const filters = {
    ...(params.artista ? { artistSlug: params.artista } : {}),
    ...(params.categoria
      ? {
          category: params.categoria as
            | 'pintura'
            | 'escultura'
            | 'desenho'
            | 'gravura'
            | 'fotografia'
            | 'objeto'
            | 'antiguidade',
        }
      : {}),
    ...(params.busca ? { search: params.busca } : {}),
    sort,
  }

  const [collections, artists] = await Promise.all([getPublishedCollections(), getPublishedArtists()])

  const activeCollection = params.colecao ? await getCollectionBySlug(params.colecao) : null

  const [pieces, totalCount] = params.colecao
    ? await Promise.all([
        getPiecesByCollectionSlug(params.colecao, ACERVO_PAGE_SIZE, offset),
        countCollectionPiecesBySlug(params.colecao),
      ])
    : await Promise.all([
        getPublicPieces({ ...filters, limit: ACERVO_PAGE_SIZE, offset }),
        countPublicPieces(filters),
      ])

  const filtered = hasActiveFilters(params)
  const activeArtist = artists.find((a) => a.slug === params.artista)
  const siteUrl = getSiteUrl()
  const showCollectionsGrid = !filtered && !params.colecao

  const schema = [
    breadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Acervo', path: '/acervo' },
      ...(activeCollection
        ? [{ name: activeCollection.title_pt, path: `/acervo?colecao=${activeCollection.slug}` }]
        : []),
    ]),
    collectionPageSchema({
      path: params.colecao ? `/acervo?colecao=${params.colecao}` : '/acervo',
      name: activeCollection?.title_pt ?? 'Acervo Cabral & Souza',
      description: activeCollection?.description_pt ?? null,
      items: pieces.map((p) => ({
        name: p.title_pt,
        url: `${siteUrl}/acervo/${p.slug}`,
      })),
    }),
    itemListSchema(
      pieces.map((p) => ({
        name: p.title_pt,
        url: `${siteUrl}/acervo/${p.slug}`,
      })),
    ),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <PageHeader
        section={activeCollection ? 'Coleção' : 'Coleções'}
        title={activeCollection?.title_pt ?? 'Acervo Cabral & Souza'}
        subtitle={
          activeCollection?.description_pt ??
          'Obras selecionadas com critério histórico, estético e documental — cada peça acompanhada de verificação de autenticidade e proveniência.'
        }
      />

      {showCollectionsGrid && collections.length > 0 && (
        <Reveal>
          <section aria-label="Coleções curatoriais" className="section-padding bg-cream-100 border-b border-cream-200">
            <div className="container-default">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.map((collection, i) => (
                  <Reveal key={collection.id} delay={i * 80}>
                    <CollectionCard collection={collection} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      <AcervoFilters params={params} artists={artists} />

      <section className="section-default bg-cream-100">
        <div className="container-default">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="font-display font-medium text-title-sm text-ink-800">
              {activeCollection ? `Obras · ${activeCollection.title_pt}` : 'Todas as obras'}
            </h2>
            {filtered && (
              <Link
                href="/acervo"
                className="font-body text-body-sm font-medium text-bronze-500 hover:underline hover:underline-offset-4"
              >
                Limpar filtros
              </Link>
            )}
          </div>

          {filtered && totalCount > 0 && (
            <p className="font-body text-caption text-ink-700 mb-8">
              {totalCount} {totalCount === 1 ? 'obra encontrada' : 'obras encontradas'}
              {activeArtist ? ` · ${activeArtist.name}` : ''}
              {params.categoria ? ` · ${CATEGORY_LABELS[params.categoria] ?? params.categoria}` : ''}
              {params.busca ? ` · “${params.busca}”` : ''}
            </p>
          )}

          {!filtered && totalCount > 0 && (
            <p className="font-body text-caption text-ink-700 mb-8">
              {totalCount} {totalCount === 1 ? 'obra' : 'obras'}
            </p>
          )}

          {pieces.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-title-sm text-ink-700 mb-4">
                {filtered
                  ? 'Nenhuma obra corresponde aos filtros selecionados'
                  : 'Nenhuma obra disponível no momento'}
              </p>
              <p className="font-body text-body text-ink-700/70 max-w-md mx-auto mb-8">
                {filtered
                  ? 'Tente outros critérios ou limpe os filtros para ver o acervo completo.'
                  : 'Nosso acervo é renovado continuamente. Entre em contato para saber sobre obras disponíveis.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {filtered && (
                  <Link
                    href="/acervo"
                    className="font-body font-medium uppercase tracking-caps text-eyebrow text-ink-800 border border-ink-800 hover:bg-ink-800 hover:text-cream-100 px-8 py-3 rounded-md transition-colors"
                  >
                    Limpar filtros
                  </Link>
                )}
                <Link
                  href="/contato"
                  className="font-body font-medium uppercase tracking-caps text-eyebrow text-cream-100 bg-bronze-500 hover:bg-bronze-700 px-8 py-3 rounded-md transition-colors"
                >
                  Consultar
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {pieces.map((piece, i) => (
                  <PieceArtworkCard key={piece.id} piece={piece} priority={i < 4} locale={locale} />
                ))}
              </div>
              <AcervoPagination params={params} totalCount={totalCount} page={page} />
            </>
          )}
        </div>
      </section>
    </>
  )
}
