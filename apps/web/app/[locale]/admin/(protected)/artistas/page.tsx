import Link from 'next/link'
import { getAdminArtists } from '../../../../../lib/queries/admin'

export const metadata = { title: 'Artistas' }

export default async function AdminArtistsPage() {
  const artists = await getAdminArtists()

  return (
    <div className="max-w-[800px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
          Artistas <span className="text-[--color-ink-subtle] text-[1.25rem]">({artists.length})</span>
        </h1>
        <Link
          href="/admin/artistas/novo"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-5 py-2.5 transition-colors"
        >
          + Novo artista
        </Link>
      </div>

      {artists.length === 0 ? (
        <div className="border border-dashed border-[--color-border] p-16 text-center">
          <p className="font-body text-[13px] text-[--color-ink-subtle]">
            Nenhum artista cadastrado.
          </p>
        </div>
      ) : (
        <div className="border border-[--color-border] divide-y divide-[--color-border]">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-[--color-surface] transition-colors"
            >
              <div>
                <p className="font-body text-[13px] text-[--color-ink]">{artist.name}</p>
                <p className="font-body text-[11px] text-[--color-ink-subtle]">
                  {artist.nationality && `${artist.nationality} · `}
                  {artist.birth_year && (
                    artist.death_year
                      ? `${artist.birth_year}–${artist.death_year}`
                      : `n. ${artist.birth_year}`
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={[
                  'font-body text-[10px] uppercase tracking-[0.08em] px-2.5 py-1',
                  artist.is_published
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                ].join(' ')}>
                  {artist.is_published ? 'Publicado' : 'Rascunho'}
                </span>
                <Link
                  href={`/admin/artistas/${artist.id}`}
                  className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:underline"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
