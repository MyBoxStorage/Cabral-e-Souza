import { cn } from '../lib/cn'
import { Seal } from './Seal'

export type ArtworkStatus = 'available' | 'reserved' | 'sold'

export interface ArtworkCardData {
  image: React.ReactNode
  alt: string
  category?: string
  title: string
  artist?: string
  medium?: string
  year?: string
  dimensions?: string
  price?: string | null
  status?: ArtworkStatus
  href?: string
  whatsappHref?: string
  showCuratedSeal?: boolean
}

export interface ArtworkCardProps {
  artwork: ArtworkCardData
  className?: string
}

function TechnicalLine({ artwork }: { artwork: ArtworkCardData }) {
  const parts = [artwork.artist, artwork.medium, artwork.year, artwork.dimensions].filter(Boolean)
  if (parts.length === 0) return null

  return (
    <p className="font-display italic text-caption text-ink-700 leading-relaxed">
      {parts.join(' · ')}
    </p>
  )
}

export function ArtworkCard({ artwork, className }: ArtworkCardProps) {
  const {
    image,
    category,
    title,
    price,
    status = 'available',
    href,
    whatsappHref,
    showCuratedSeal = true,
  } = artwork

  const statusLabel =
    status === 'reserved' ? 'Reservada' : status === 'sold' ? 'Vendida' : null

  const imageBlock = (
    <div
      className={cn(
        'artwork-card__frame',
        'border-2 border-bronze-500 bg-cream-100 p-4',
        'transition-[border-color,box-shadow,transform] duration-base ease-smooth',
        'group-hover:-translate-y-1 group-hover:border-bronze-700 group-hover:shadow-lg',
      )}
    >
      <div className="relative w-full [&_img]:w-full [&_img]:h-auto [&_img]:object-contain">{image}</div>
    </div>
  )

  return (
    <article className={cn('artwork-card group', className)}>
      <div className="artwork-card__image-wrapper relative mb-4">
        {href ? (
          <a
            href={href}
            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
            aria-label={title}
          >
            {imageBlock}
          </a>
        ) : (
          imageBlock
        )}

        <div className="artwork-card__seals absolute inset-x-0 top-0 flex justify-between p-3 pointer-events-none">
          {showCuratedSeal && <Seal variant="curated">Acervo Curado</Seal>}
          {statusLabel && <Seal variant="status">{statusLabel}</Seal>}
        </div>
      </div>

      <div className="artwork-card__meta flex flex-col gap-1">
        {category && (
          <span className="artwork-card__eyebrow font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500">
            {category}
          </span>
        )}

        {href ? (
          <a href={href} className="block group/title">
            <h3 className="artwork-card__title font-display font-medium text-title-xs text-ink-800 leading-snug group-hover/title:text-bronze-500 transition-colors duration-base">
              {title}
            </h3>
          </a>
        ) : (
          <h3 className="artwork-card__title font-display font-medium text-title-xs text-ink-800 leading-snug">
            {title}
          </h3>
        )}

        <TechnicalLine artwork={artwork} />

        <p className="artwork-card__price font-body text-body-sm text-ink-800 mt-1">
          {price ?? 'Sob consulta'}
        </p>

        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="artwork-card__cta font-body text-body-sm font-medium text-bronze-500 mt-2 hover:underline hover:underline-offset-4 w-fit"
          >
            Consultar via WhatsApp →
          </a>
        )}
      </div>
    </article>
  )
}
