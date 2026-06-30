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
      >
        <div className="relative overflow-hidden bg-[--color-paper-muted] aspect-[3/4] mb-4">
          {artist.hero_image_url ? (
            <Image
              src={artist.hero_image_url}
              alt={`${artist.name} — retrato`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[2rem] font-light text-[--color-ink-subtle]">
                {artist.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-[--color-ink]/0 group-hover:bg-[--color-ink]/10 transition-colors duration-300" />
        </div>

        <h3 className="font-display text-[1.125rem] font-light text-[--color-ink] group-hover:text-[--color-accent] transition-colors">
          {artist.name}
        </h3>
        {years && (
          <p className="font-body text-[12px] text-[--color-ink-subtle] mt-1">{years}</p>
        )}
      </Link>
    </article>
  )
}
