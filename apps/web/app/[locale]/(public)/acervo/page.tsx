import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { AcervoFilters } from '../../../../components/artwork/AcervoFilters'
import { AcervoPagination } from '../../../../components/artwork/AcervoPagination'
import { PieceCard } from '../../../../components/artwork/PieceCard'
import { JsonLd } from '../../../../components/seo/JsonLd'
import {
  ACERVO_PAGE_SIZE,
  CATEGORY_LABELS,
  hasActiveFilters,
  type AcervoSearchParams,
} from '../../../../lib/acervo'
import { getPublishedArtists } from '../../../../lib/queries/artists'
import { countPublicPieces, getPublicPieces } from '../../../../lib/queries/pieces'
import { buildPageMetadata, getSiteUrl } from '../../../../lib/seo/metadata'
import { breadcrumbSchema, itemListSchema } from '../../../../lib/seo/schema'

export const revalidate = 3600

interface AcervoPageProps {
  searchParams: Promise<AcervoSearchParams>
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Acervo',
    description:
      'Obras de Di Cavalcanti, Alfredo Volpi, Djanira, Sergio Camargo e outros mestres da arte brasileira moderna e contemporânea. Autenticidade garantida.',
    path: '/acervo',
  })
}

export default async function AcervoPage({ searchParams }: AcervoPageProps) {
  const params = await searchParams
  const t = await getTranslations('nav')
  const page = Math.max(1, parseInt(params.pagina ?? '1', 10) || 1)
  const offset = (page - 1) * ACERVO_PAGE_SIZE

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
  }

  const [pieces, totalCount, artists] = await Promise.all([
    getPublicPieces({ ...filters, limit: ACERVO_PAGE_SIZE, offset }),
    countPublicPieces(filters),
    getPublishedArtists(),
  ])

  const filtered = hasActiveFilters(params)
  const activeArtist = artists.find((a) => a.slug === params.artista)
  const siteUrl = getSiteUrl()

  const schema = [
    breadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Acervo', path: '/acervo' },
    ]),
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

      <AcervoFilters params={params} artists={artists} />

      <section className="pb-12 md:pb-16">
        <div className="container-default">
          {filtered && totalCount > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <p className="font-body text-[12px] text-[--color-ink-subtle]">
                {totalCount} {totalCount === 1 ? 'obra encontrada' : 'obras encontradas'}
                {activeArtist ? ` · ${activeArtist.name}` : ''}
                {params.categoria ? ` · ${CATEGORY_LABELS[params.categoria] ?? params.categoria}` : ''}
                {params.busca ? ` · “${params.busca}”` : ''}
              </p>
              <Link
                href="/acervo"
                className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:text-[--color-accent-deep] transition-colors"
              >
                Limpar filtros
              </Link>
            </div>
          )}

          {!filtered && totalCount > 0 && (
            <p className="font-body text-[12px] text-[--color-ink-subtle] mb-8">
              {totalCount} {totalCount === 1 ? 'obra' : 'obras'}
            </p>
          )}

          {pieces.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-[1.5rem] font-light text-[--color-ink-subtle] mb-4">
                {filtered
                  ? 'Nenhuma obra corresponde aos filtros selecionados'
                  : 'Nenhuma obra disponível no momento'}
              </p>
              <p className="font-body text-[13px] text-[--color-ink-subtle] max-w-[40ch] mx-auto">
                {filtered
                  ? 'Tente outros critérios ou limpe os filtros para ver o acervo completo.'
                  : 'Nosso acervo é renovado continuamente. Entre em contato para saber sobre obras disponíveis.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                {filtered && (
                  <Link
                    href="/acervo"
                    className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-paper] px-8 py-4 transition-colors duration-200"
                  >
                    Limpar filtros
                  </Link>
                )}
                <Link
                  href="/contato"
                  className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-8 py-4 transition-colors duration-200"
                >
                  Consultar
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {pieces.map((piece, i) => (
                  <PieceCard key={piece.id} piece={piece} priority={i < 4} />
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
