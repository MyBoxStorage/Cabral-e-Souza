import Image from 'next/image'
import Link from 'next/link'
import type { ArtistListItem } from '../../lib/queries/artists'
import { artistYears } from '../../lib/format'

interface ArtistCardProps {
  artist: ArtistListItem
  priority?: boolean
}

export function ArtistCard({ artist, priority = false }: ArtistCardProps) {
  const years = artistYears(artist.birth_year, artist.death_year)
  const nationality = artist.nationality

  return (
    <article className="group">
      <Link
        href={`/artistas/${artist.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
      >
        <div
          className={[
            'relative aspect-[3/4] mb-4 border-2 border-bronze-500 bg-cream-200 overflow-hidden',
            'transition-[border-color,transform,box-shadow] duration-base ease-smooth',
            'group-hover:-translate-y-1 group-hover:border-bronze-700 group-hover:shadow-lg',
          ].join(' ')}
        >
          {artist.hero_image_url ? (
            <Image
              src={artist.hero_image_url}
              alt={`${artist.name} — retrato`}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-cover transition-transform duration-slow group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-title-md text-ink-700/40">{artist.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base pb-4">
            <span className="font-body text-eyebrow font-medium uppercase tracking-caps text-cream-100">
              Ver verbete →
            </span>
          </div>
        </div>

        <h3 className="font-display font-medium text-title-xs text-ink-800 group-hover:text-bronze-500 transition-colors duration-base">
          {artist.name}
        </h3>
        {(years || nationality) && (
          <p className="font-body text-caption text-ink-700 mt-1">
            {[years, nationality].filter(Boolean).join(' · ')}
          </p>
        )}
      </Link>
    </article>
  )
}
