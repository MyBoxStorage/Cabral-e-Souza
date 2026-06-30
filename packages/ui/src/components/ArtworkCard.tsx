import { cn } from '../lib/cn'

export type ArtworkStatus = 'available' | 'reserved' | 'sold'

export interface ArtworkCardData {
  image: React.ReactNode
  alt: string
  /** Eyebrow line — e.g. "PINTURA A ÓLEO · PINTURA" */
  category?: string
  title: string
  artist?: string
  medium?: string
  year?: string
  dimensions?: string
  status?: ArtworkStatus
  href?: string
  whatsappHref?: string
}

export interface ArtworkCardProps {
  artwork: ArtworkCardData
  className?: string
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="badge-corner absolute top-3 right-3 z-10 whitespace-nowrap border border-bronze-500 bg-cream-100/95 px-2.5 py-1 font-body text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-bronze-500">
      {label}
    </span>
  )
}

function TechnicalLine({ artwork }: { artwork: ArtworkCardData }) {
  const parts = [artwork.artist, artwork.medium, artwork.year, artwork.dimensions].filter(Boolean)
  if (parts.length === 0) return null

  return (
    <p className="artwork-card__technical font-display italic text-caption text-ink-700 leading-normal line-clamp-2">
      {parts.join(' · ')}
    </p>
  )
}

export function ArtworkCard({ artwork, className }: ArtworkCardProps) {
  const { image, category, title, status = 'available', href, whatsappHref } = artwork

  const statusLabel =
    status === 'reserved' ? 'Reservada' : status === 'sold' ? 'Vendida' : null

  const imageInner = (
    <>
      {image}
      {statusLabel && <StatusBadge label={statusLabel} />}
    </>
  )

  return (
    <article
      className={cn(
        'artwork-card group bg-cream-50 border border-transparent',
        'transition-[border-color,box-shadow,transform] duration-base ease-smooth',
        'hover:border-bronze-300 hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="artwork-card__image relative aspect-[4/5] overflow-hidden bg-cream-100">
        {href ? (
          <a
            href={href}
            className="block relative w-full h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
            aria-label={title}
          >
            {imageInner}
          </a>
        ) : (
          imageInner
        )}
      </div>

      <div className="artwork-card__body flex flex-col gap-3 px-5 py-6">
        {category && (
          <span className="artwork-card__eyebrow font-body text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-bronze-500">
            {category}
          </span>
        )}

        {href ? (
          <a href={href} className="block group/title">
            <h3 className="artwork-card__title font-display font-medium text-title-sm text-ink-800 leading-snug line-clamp-2 m-0 group-hover/title:text-bronze-500 transition-colors duration-base">
              {title}
            </h3>
          </a>
        ) : (
          <h3 className="artwork-card__title font-display font-medium text-title-sm text-ink-800 leading-snug line-clamp-2 m-0">
            {title}
          </h3>
        )}

        <TechnicalLine artwork={artwork} />

        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="artwork-card__cta group/cta mt-1 inline-flex items-center gap-2 font-body text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-bronze-500 hover:text-bronze-700 w-fit transition-colors duration-base"
          >
            Consultar via WhatsApp
            <span
              aria-hidden
              className="inline-block transition-transform duration-base ease-smooth group-hover/cta:translate-x-1"
            >
              →
            </span>
          </a>
        )}
      </div>
    </article>
  )
}
