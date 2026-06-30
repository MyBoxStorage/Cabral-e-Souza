import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArtistForm } from '../../../../../../components/admin/ArtistForm'
import { getAdminArtistById } from '../../../../../../lib/queries/admin'

export const metadata = { title: 'Editar Artista' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditArtistPage({ params }: Props) {
  const { id } = await params
  const artist = await getAdminArtistById(id)

  if (!artist) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/artistas"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] hover:text-[--color-ink] transition-colors"
        >
          ← Artistas
        </Link>
        <span className="text-[--color-border]">/</span>
        <h1 className="font-display text-[1.5rem] font-light text-[--color-ink] flex-1 truncate">
          {artist.name}
        </h1>
        {artist.is_published && (
          <Link
            href={`/artistas/${artist.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:underline shrink-0"
          >
            Ver no site ↗
          </Link>
        )}
      </div>

      <ArtistForm
        artistId={id}
        initialData={artist as Record<string, unknown>}
      />
    </div>
  )
}
