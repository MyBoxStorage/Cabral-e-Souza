import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ImageGallery } from '../../../../../components/artwork/ImageGallery'
import { LeadForm } from '../../../../../components/artwork/LeadForm'
import { JsonLd } from '../../../../../components/seo/JsonLd'
import { CATEGORY_LABELS } from '../../../../../lib/acervo'
import { formatBRL, formatDimensions, formatYear, artistYears } from '../../../../../lib/format'
import { getPieceBySlug, getPieceSlugs, getDisplayPrice } from '../../../../../lib/queries/pieces'
import { buildPageMetadata } from '../../../../../lib/seo/metadata'
import { breadcrumbSchema, visualArtworkSchema } from '../../../../../lib/seo/schema'

export const revalidate = 300

interface PiecePageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const slugs = await getPieceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PiecePageProps): Promise<Metadata> {
  const { slug } = await params
  const piece = await getPieceBySlug(slug)
  if (!piece) return { title: 'Obra não encontrada' }

  const artist = piece.artists?.name ?? ''
  const year = formatYear(piece.year_created, piece.year_created_circa)
  const ogImage = piece.piece_images[0]?.url_large ?? piece.piece_images[0]?.url_original

  return buildPageMetadata({
    title: `${piece.title_pt}${artist ? ` — ${artist}` : ''}`,
    description:
      piece.seo_description_pt ??
      [piece.technique_pt, year, piece.description_pt?.slice(0, 140)].filter(Boolean).join('. '),
    path: `/acervo/${slug}`,
    ...(ogImage ? { ogImage } : {}),
    ogType: 'article',
  })
}

export default async function PiecePage({ params }: PiecePageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const piece = await getPieceBySlug(slug)
  if (!piece) notFound()

  const artist = piece.artists
  const displayPrice = getDisplayPrice(piece)
  const title = locale === 'en-US' ? (piece.title_en ?? piece.title_pt)
    : locale === 'fr-FR' ? (piece.title_fr ?? piece.title_pt)
    : piece.title_pt

  const description = locale === 'en-US' ? (piece.description_en ?? piece.description_pt)
    : locale === 'fr-FR' ? (piece.description_fr ?? piece.description_pt)
    : piece.description_pt

  // Schema.org
  const images = piece.piece_images
    .map((img) => img.url_large ?? img.url_original)
    .filter(Boolean)

  const schema = [
    breadcrumbSchema([
      { name: 'Acervo', path: '/acervo' },
      { name: title, path: `/acervo/${slug}` },
    ]),
    visualArtworkSchema({
      slug,
      title,
      description,
      images,
      technique: piece.technique_pt,
      heightCm: piece.height_cm,
      widthCm: piece.width_cm,
      year: formatYear(piece.year_created, piece.year_created_circa),
      price: displayPrice,
      artist: artist
        ? {
            name: artist.name,
            slug: artist.slug,
            birthYear: artist.birth_year,
            deathYear: artist.death_year,
            nationality: artist.nationality,
          }
        : null,
    }),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="container-default py-12 md:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 list-none font-body text-[12px] text-[--color-ink-subtle]">
            <li><Link href="/acervo" className="hover:text-[--color-accent] transition-colors">Acervo</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[--color-ink] truncate max-w-[30ch]">{title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 xl:gap-20">
          {/* Galeria */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ImageGallery images={piece.piece_images} title={title} />
          </div>

          {/* Dados */}
          <div className="flex flex-col gap-8">
            {/* Cabeçalho */}
            <div>
              {artist && (
                <Link
                  href={`/artistas/${artist.slug}`}
                  className="inline-block font-body text-[12px] uppercase tracking-[0.1em] text-[--color-accent] hover:text-[--color-accent-deep] mb-3 transition-colors"
                >
                  {artist.name}
                  {artistYears(artist.birth_year, artist.death_year) && (
                    <span className="text-[--color-ink-subtle] normal-case tracking-normal ml-2">
                      {artistYears(artist.birth_year, artist.death_year)}
                    </span>
                  )}
                </Link>
              )}
              <h1 className="font-display text-[2rem] md:text-[2.5rem] font-light leading-[1.1] tracking-[-0.02em] text-[--color-ink]">
                {title}
              </h1>
            </div>

            {/* Ficha Técnica */}
            <div>
              <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-4">
                Ficha Técnica
              </h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
                {[
                  { label: 'Técnica', value: piece.technique_pt },
                  { label: 'Ano', value: formatYear(piece.year_created, piece.year_created_circa) },
                  { label: 'Dimensões', value: formatDimensions(piece.height_cm, piece.width_cm, piece.depth_cm) },
                  { label: 'Categoria', value: piece.category ? CATEGORY_LABELS[piece.category] ?? piece.category : undefined },
                  { label: 'Assinada', value: piece.is_signed ? 'Sim' : piece.is_signed === false ? 'Não' : undefined },
                  { label: 'Origem', value: piece.origin === 'propria' ? 'Acervo próprio' : piece.origin === 'consignada' ? 'Consignada' : 'Parceria' },
                ]
                  .filter((r) => r.value)
                  .map((row) => (
                    <div key={row.label} className="contents">
                      <dt className="font-body text-[12px] text-[--color-ink-subtle] whitespace-nowrap">{row.label}</dt>
                      <dd className="font-body text-[13px] text-[--color-ink]">{row.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Descrição */}
            {description && (
              <div>
                <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-4">
                  Texto Curatorial
                </h2>
                <p className="font-body text-[14px] leading-[1.8] text-[--color-ink-muted] whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {/* Preço */}
            <div className="border-t border-b border-[--color-paper-deep] py-5">
              <p className="font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle] mb-1">
                Valor
              </p>
              <p className="font-display text-[1.75rem] font-light text-[--color-ink]">
                {displayPrice !== null ? formatBRL(displayPrice) : 'Sob consulta'}
              </p>
            </div>

            {/* Proveniência */}
            {piece.provenance_pt && (
              <div>
                <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-4">
                  Proveniência
                </h2>
                <p className="font-body text-[13px] leading-[1.7] text-[--color-ink-muted] whitespace-pre-line">
                  {piece.provenance_pt}
                </p>
              </div>
            )}

            {/* Comparáveis */}
            {piece.auction_comparables.length > 0 && (
              <div>
                <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-4">
                  Referências de Mercado
                </h2>
                <div className="flex flex-col gap-3">
                  {piece.auction_comparables.map((c) => (
                    <div key={c.id} className="border border-[--color-paper-deep] p-4 text-[13px]">
                      <p className="font-body font-medium text-[--color-ink]">
                        {c.work_title ?? 'Obra similar'} {c.work_year ? `(${c.work_year})` : ''}
                      </p>
                      <p className="font-body text-[--color-ink-subtle] mt-1">
                        {c.auction_house} · {new Date(c.auction_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                      </p>
                      {c.hammer_price && (
                        <p className="font-body text-[--color-accent] mt-1">
                          Martelo: {c.currency} {c.hammer_price.toLocaleString('pt-BR')}
                          {c.currency_at_brl && ` (≈ ${formatBRL(Number(c.currency_at_brl))})`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-4 border-t border-[--color-paper-deep]">
              <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-6">
                Tenho interesse nesta obra
              </h2>
              <LeadForm
                pieceId={piece.id}
                pieceTitle={piece.title_pt}
              />
            </div>
          </div>
        </div>

        {/* Alerta IPHAN */}
        {piece.iphan_restricted && (
          <aside
            role="note"
            className="mt-12 border border-[--color-warning]/30 bg-[--color-warning]/5 p-5"
          >
            <p className="font-body text-[12px] text-[--color-ink-muted] leading-relaxed">
              <span className="font-medium text-[--color-warning]">Atenção:</span>{' '}
              Esta obra está sujeita à legislação de proteção do patrimônio cultural brasileiro (Lei 4.845/1965).
              A exportação do Brasil requer autorização prévia do IPHAN.
              {piece.iphan_notes && ` ${piece.iphan_notes}`}
            </p>
          </aside>
        )}
      </div>
    </>
  )
}
