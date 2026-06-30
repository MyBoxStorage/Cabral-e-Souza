import type { Metadata } from 'next'
import { Button, FrameOrnamental, Seal, SectionHeader } from '@cabral-souza/ui'
import { whatsappUrl } from '@cabral-souza/shared'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CuratorialEssay } from '../../../../../components/artwork/CuratorialEssay'
import { ImageGallery } from '../../../../../components/artwork/ImageGallery'
import { LeadForm } from '../../../../../components/artwork/LeadForm'
import { PieceArtworkCard } from '../../../../../components/artwork/PieceArtworkCard'
import { JsonLd } from '../../../../../components/seo/JsonLd'
import { CATEGORY_LABELS } from '../../../../../lib/acervo'
import { formatBRL, formatDimensions, formatYear, artistYears } from '../../../../../lib/format'
import { getPrimaryCollectionForPiece } from '../../../../../lib/queries/collections'
import {
  getDisplayPrice,
  getPieceBySlug,
  getPieceSlugs,
  getRelatedPieces,
} from '../../../../../lib/queries/pieces'
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

function TechnicalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(7rem,9rem)_1fr] gap-x-6 gap-y-1 py-3 border-b border-cream-200 last:border-0">
      <dt className="font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500">
        {label}
      </dt>
      <dd className="font-display italic text-body text-ink-800">{value}</dd>
    </div>
  )
}

export default async function PiecePage({ params }: PiecePageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const piece = await getPieceBySlug(slug)
  if (!piece) notFound()

  const artist = piece.artists
  const displayPrice = getDisplayPrice(piece)
  const collection = await getPrimaryCollectionForPiece(piece.id)
  const relatedPieces = await getRelatedPieces(piece.id, piece.artist_id, 4)

  const title =
    locale === 'en-US'
      ? (piece.title_en ?? piece.title_pt)
      : locale === 'fr-FR'
        ? (piece.title_fr ?? piece.title_pt)
        : piece.title_pt

  const description =
    locale === 'en-US'
      ? (piece.description_en ?? piece.description_pt)
      : locale === 'fr-FR'
        ? (piece.description_fr ?? piece.description_pt)
        : piece.description_pt

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

  const technicalRows = [
    { label: 'Medium', value: piece.technique_pt },
    { label: 'Ano', value: formatYear(piece.year_created, piece.year_created_circa) },
    {
      label: 'Dimensões',
      value: formatDimensions(piece.height_cm, piece.width_cm, piece.depth_cm),
    },
    { label: 'Procedência', value: piece.provenance_pt },
    { label: 'Estado', value: piece.condition_pt },
    {
      label: 'Assinatura',
      value: piece.is_signed
        ? piece.signature_location
          ? `Sim — ${piece.signature_location}`
          : 'Sim'
        : piece.is_signed === false
          ? 'Não'
          : undefined,
    },
    {
      label: 'Categoria',
      value: piece.category ? (CATEGORY_LABELS[piece.category] ?? piece.category) : undefined,
    },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))

  const statusSeal =
    piece.status === 'reservado' ? 'Reservada' : piece.status === 'vendido' ? 'Vendida' : null

  const waMessage = `Olá! Vim do site cabralesouza.com.br e gostaria de consultar sobre a obra "${piece.title_pt}".`

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-cream-100 border-b border-cream-200">
        <div className="container-default py-12 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 list-none font-body text-caption text-ink-700">
              <li>
                <Link href="/acervo" className="hover:text-bronze-500 transition-colors">
                  Acervo
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink-800 truncate max-w-[30ch]">
                {title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] gap-12 xl:gap-20 items-start">
            <div className="lg:sticky lg:top-28">
              <FrameOrnamental variant="medium" className="w-full [&_.relative]:bg-cream-100 p-8">
                <ImageGallery images={piece.piece_images} title={title} />
              </FrameOrnamental>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
                  Acervo
                  {collection ? ` · ${collection.title_pt}` : ''}
                </p>
                <h1 className="font-display font-normal text-title-md text-ink-800 mb-4">{title}</h1>
                {artist && (
                  <Link
                    href={`/artistas/${artist.slug}`}
                    className="font-display italic text-title-xs text-bronze-500 hover:text-bronze-700 transition-colors"
                  >
                    {artist.name}
                    {artistYears(artist.birth_year, artist.death_year) &&
                      ` ${artistYears(artist.birth_year, artist.death_year)}`}
                  </Link>
                )}
              </div>

              <dl className="border-t border-cream-200">
                {technicalRows.map((row) => (
                  <TechnicalRow key={row.label} label={row.label} value={row.value} />
                ))}
              </dl>

              <div>
                <p className="font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500 mb-2">
                  Valor
                </p>
                <p className="font-display text-title-sm text-ink-800">
                  {displayPrice !== null ? formatBRL(displayPrice) : 'Sob consulta'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Seal variant="curated">Acervo Curado</Seal>
                {statusSeal && <Seal variant="status">{statusSeal}</Seal>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild variant="primary" size="lg">
                  <a href={whatsappUrl(waMessage)} target="_blank" rel="noopener noreferrer">
                    Consultar via WhatsApp
                  </a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#interesse-form">Solicitar mais informações</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {description && <CuratorialEssay content={description} />}

      {piece.piece_images.length > 1 && (
        <section className="section-padding bg-cream-50 border-t border-cream-200">
          <div className="container-default">
            <SectionHeader eyebrow="Detalhes" title="Galeria de imagens" className="mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {piece.piece_images.slice(1).map((img) => (
                <div
                  key={img.id}
                  className="border-2 border-bronze-500/30 bg-cream-100 p-3 aspect-[4/3] relative overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url_medium ?? img.url_original}
                    alt={img.alt_text_pt ?? title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedPieces.length > 0 && artist && (
        <section className="section-padding bg-cream-100">
          <div className="container-default">
            <SectionHeader
              eyebrow="Acervo"
              title={`Outras obras de ${artist.name}`}
              link={{ href: `/artistas/${artist.slug}`, label: 'Ver artista' }}
              className="mb-10"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedPieces.map((related) => (
                <PieceArtworkCard key={related.id} piece={related} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="interesse-form" className="section-padding bg-bronze-500/10 border-t border-bronze-500/20">
        <div className="container-default max-w-2xl mx-auto text-center">
          <h2 className="font-display font-normal text-title-sm text-ink-800 mb-3">
            Interessado nesta obra?
          </h2>
          <p className="font-body text-body text-ink-700 mb-8 leading-relaxed">
            Nossa equipe orienta colecionadores em cada etapa — da consulta inicial à documentação de
            aquisição, com transparência e confidencialidade.
          </p>
          <LeadForm pieceId={piece.id} pieceTitle={piece.title_pt} />
        </div>
      </section>

      {piece.iphan_restricted && (
        <aside role="note" className="container-default py-8">
          <div className="border border-bronze-500/30 bg-cream-50 p-6">
            <p className="font-body text-body-sm text-ink-700 leading-relaxed">
              <span className="font-medium text-bronze-700">Atenção:</span> Esta obra está sujeita à
              legislação de proteção do patrimônio cultural brasileiro (Lei 4.845/1965). A exportação
              do Brasil requer autorização prévia do IPHAN.
              {piece.iphan_notes && ` ${piece.iphan_notes}`}
            </p>
          </div>
        </aside>
      )}
    </>
  )
}
