import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PieceForm } from '../../../../../../components/admin/PieceForm'
import { getAdminArtists, getAdminPieceById } from '../../../../../../lib/queries/admin'
import { deletePiece } from '../../../../../../app/actions/piece'

export const metadata = { title: 'Editar Peça' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPiecePage({ params }: Props) {
  const { id } = await params
  const [piece, artists] = await Promise.all([
    getAdminPieceById(id),
    getAdminArtists(),
  ])

  if (!piece) notFound()

  const artistId = Array.isArray(piece.artists)
    ? piece.artists[0]?.id
    : (piece.artists as { id?: string } | null)?.id

  const initialData = {
    ...piece,
    artist_id: artistId ?? '',
  }

  const rawImages = (piece.piece_images ?? []) as {
    id: string; url_original: string; is_primary: boolean; sort_order: number
  }[]
  const images = rawImages.map((img) => ({
    id: img.id,
    url: img.url_original,
    is_primary: img.is_primary,
    order: img.sort_order,
  }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/pecas"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] hover:text-[--color-ink] transition-colors"
        >
          ← Acervo
        </Link>
        <span className="text-[--color-border]">/</span>
        <h1 className="font-display text-[1.5rem] font-light text-[--color-ink] flex-1 truncate">
          {piece.title_pt}
        </h1>
        {piece.status === 'publico' && (
          <Link
            href={`/acervo/${piece.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:underline shrink-0"
          >
            Ver no site ↗
          </Link>
        )}
      </div>

      <PieceForm
        pieceId={id}
        artists={artists.map((a) => ({ id: a.id, name: a.name }))}
        initialData={initialData as Record<string, unknown>}
        images={images}
      />

      {/* Zona de perigo */}
      <div className="mt-12 pt-6 border-t border-red-100">
        <h3 className="font-body text-[11px] uppercase tracking-[0.1em] text-red-500 mb-3">
          Zona de perigo
        </h3>
        <form
          action={async () => {
            'use server'
            await deletePiece(id)
          }}
        >
          <button
            type="submit"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-red-600 border border-red-200 hover:bg-red-50 px-5 py-2 transition-colors"
            onClick={(e) => {
              if (!confirm(`Excluir "${piece.title_pt}" permanentemente?`)) e.preventDefault()
            }}
          >
            Excluir peça
          </button>
        </form>
      </div>
    </div>
  )
}
