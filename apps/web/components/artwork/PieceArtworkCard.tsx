import Image from 'next/image'
import { ArtworkCard, type ArtworkStatus } from '@cabral-souza/ui'
import { whatsappUrl } from '@cabral-souza/shared'
import { formatDimensions, formatYear, getLocalizedTitle } from '../../lib/format'
import { type PieceListItem } from '../../lib/queries/pieces'

const CATEGORY_LABELS: Record<string, string> = {
  pintura: 'Pintura',
  escultura: 'Escultura',
  desenho: 'Desenho',
  gravura: 'Gravura',
  fotografia: 'Fotografia',
  objeto: 'Objeto',
  antiguidade: 'Antiguidade',
  mobiliario: 'Mobiliário',
  outro: 'Outro',
}

function mapStatus(status: string): ArtworkStatus {
  if (status === 'reservado') return 'reserved'
  if (status === 'vendido') return 'sold'
  return 'available'
}

function buildEyebrow(piece: PieceListItem): string | undefined {
  const categoryLabel = CATEGORY_LABELS[piece.category] ?? piece.category
  const parts = [piece.technique_pt, categoryLabel].filter(Boolean)
  if (parts.length === 0) return undefined
  return parts.join(' · ').toUpperCase()
}

interface PieceArtworkCardProps {
  piece: PieceListItem
  locale?: string
  priority?: boolean
}

export function PieceArtworkCard({ piece, locale = 'pt-BR', priority = false }: PieceArtworkCardProps) {
  const primaryImage =
    piece.piece_images
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .find((img) => img.is_primary) ?? piece.piece_images[0]

  const title = getLocalizedTitle(piece, locale)
  const dimensions = formatDimensions(piece.height_cm, piece.width_cm)
  const year = formatYear(piece.year_created, piece.year_created_circa)

  const imageNode = primaryImage ? (
    <Image
      src={primaryImage.url_medium ?? primaryImage.url_original}
      alt={primaryImage.alt_text_pt ?? title}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="h-full w-full object-cover"
      priority={priority}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-cream-200">
      <span className="font-body text-eyebrow uppercase tracking-caps text-ink-700">Sem imagem</span>
    </div>
  )

  const eyebrow = buildEyebrow(piece)

  return (
    <ArtworkCard
      artwork={{
        image: imageNode,
        alt: primaryImage?.alt_text_pt ?? title,
        ...(eyebrow ? { category: eyebrow } : {}),
        title,
        ...(piece.artists?.name ? { artist: piece.artists.name } : {}),
        ...(piece.technique_pt ? { medium: piece.technique_pt } : {}),
        ...(year ? { year } : {}),
        ...(dimensions ? { dimensions } : {}),
        status: mapStatus(piece.status),
        href: `/acervo/${piece.slug}`,
        whatsappHref: whatsappUrl(
          `Olá! Vim do site cabralesouza.com.br e gostaria de consultar sobre a obra "${title}".`,
        ),
      }}
    />
  )
}
