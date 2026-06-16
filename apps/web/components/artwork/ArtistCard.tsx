import Image from 'next/image'
import Link from 'next/link'
import { artistYears } from '../../lib/format'
import type { ArtistListItem } from '../../lib/queries/artists'

interface ArtistCardProps {
  artist: ArtistListItem
  priority?: boolean
}

export function ArtistCard({ artist, priority = false }: ArtistCardProps) {
  const years = artistYears(artist.birth_year, artist.death_year)

  return (
    <article>
      <Link
        href={`/artistas/${artist.slug}`}
        className="group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
        aria-label={`${artist.name}${years ? ` ${years}` : ''}`}
      >
        {/* Imagem */}
        <div className="relative overflow-hidden bg-[--color-paper-muted] aspect-square mb-4">
          {artist.hero_image_url ? (
            <Image
              src={artist.hero_image_url}
              alt={`${artist.name} — foto`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[--color-paper-deep]">
              <span
                className="font-display text-[3rem] font-light text-[--color-ink-subtle] select-none"
                aria-hidden
              >
                {artist.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-[1.125rem] font-light tracking-[-0.01em] text-[--color-ink] group-hover:text-[--color-accent] transition-colors duration-200">
            {artist.name}
          </h2>
          {years && (
            <p className="font-body text-[12px] text-[--color-ink-subtle]">{years}</p>
          )}
          {artist.nationality && (
            <p className="font-body text-[11px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">
              {artist.nationality}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
