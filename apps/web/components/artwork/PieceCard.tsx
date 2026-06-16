import Image from 'next/image'
import Link from 'next/link'
import { formatBRL, formatDimensions, formatYear } from '../../lib/format'
import { getDisplayPrice } from '../../lib/queries/pieces'
import type { PieceListItem } from '../../lib/queries/pieces'

interface PieceCardProps {
  piece: PieceListItem
  priority?: boolean
}

export function PieceCard({ piece, priority = false }: PieceCardProps) {
  const primaryImage = piece.piece_images
    .sort((a, b) => a.sort_order - b.sort_order)
    .find((img) => img.is_primary) ?? piece.piece_images[0]

  const displayPrice = getDisplayPrice(piece)
  const dimensions = formatDimensions(piece.height_cm, piece.width_cm)
  const year = formatYear(piece.year_created, piece.year_created_circa)

  return (
    <article>
      <Link
        href={`/acervo/${piece.slug}`}
        className="group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
        aria-label={`${piece.title_pt}${piece.artists ? `, ${piece.artists.name}` : ''}`}
      >
        {/* Imagem */}
        <div className="relative overflow-hidden bg-[--color-paper-muted] aspect-[4/5] mb-4">
          {primaryImage ? (
            <Image
              src={primaryImage.url_medium ?? primaryImage.url_original}
              alt={primaryImage.alt_text_pt ?? piece.title_pt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle]">
                Sem imagem
              </span>
            </div>
          )}

          {/* Overlay sutil no hover */}
          <div className="absolute inset-0 bg-[--color-ink]/0 group-hover:bg-[--color-ink]/8 transition-colors duration-300" />
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-1">
          {piece.artists && (
            <p className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle]">
              {piece.artists.name}
            </p>
          )}

          <h2 className="font-display text-[1.0625rem] font-light leading-snug tracking-[-0.01em] text-[--color-ink] group-hover:text-[--color-accent] transition-colors duration-200">
            {piece.title_pt}
          </h2>

          <p className="font-body text-[12px] text-[--color-ink-subtle] leading-relaxed">
            {[piece.technique_pt, year, dimensions].filter(Boolean).join(' · ')}
          </p>

          <p className="font-body text-[13px] text-[--color-ink] mt-1">
            {displayPrice !== null ? formatBRL(displayPrice) : 'Sob consulta'}
          </p>
        </div>
      </Link>
    </article>
  )
}
