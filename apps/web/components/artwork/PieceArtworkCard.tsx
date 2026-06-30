import Image from 'next/image'
import { ArtworkCard, type ArtworkStatus } from '@cabral-souza/ui'
import { whatsappUrl } from '@cabral-souza/shared'
import {
  formatBRL,
  formatDimensions,
  formatYear,
  getLocalizedTitle,
} from '../../lib/format'
import { getDisplayPrice, type PieceListItem } from '../../lib/queries/pieces'

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
  const displayPrice = getDisplayPrice(piece)
  const dimensions = formatDimensions(piece.height_cm, piece.width_cm)
  const year = formatYear(piece.year_created, piece.year_created_circa)

  const imageNode = primaryImage ? (
    <Image
      src={primaryImage.url_medium ?? primaryImage.url_original}
      alt={primaryImage.alt_text_pt ?? title}
      width={600}
      height={750}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="w-full h-auto"
      priority={priority}
    />
  ) : (
    <div className="flex items-center justify-center aspect-[4/5] bg-cream-200">
      <span className="font-body text-eyebrow uppercase tracking-caps text-ink-700">Sem imagem</span>
    </div>
  )

  return (
    <ArtworkCard
      artwork={{
        image: imageNode,
        alt: primaryImage?.alt_text_pt ?? title,
        category: CATEGORY_LABELS[piece.category] ?? piece.category,
        title,
        ...(piece.artists?.name ? { artist: piece.artists.name } : {}),
        ...(piece.technique_pt ? { medium: piece.technique_pt } : {}),
        ...(year ? { year } : {}),
        ...(dimensions ? { dimensions } : {}),
        price: displayPrice !== null ? formatBRL(displayPrice) : null,
        status: mapStatus(piece.status),
        href: `/acervo/${piece.slug}`,
        whatsappHref: whatsappUrl(
          `Olá! Vim do site cabralesouza.com.br e gostaria de consultar sobre a obra "${title}".`,
        ),
      }}
    />
  )
}
