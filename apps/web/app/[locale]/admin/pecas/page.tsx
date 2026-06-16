import Link from 'next/link'
import Image from 'next/image'
import { getAdminPieces } from '../../../../lib/queries/admin'
import { formatBRL } from '../../../../lib/format'

export const metadata = { title: 'Acervo' }

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  rascunho:  { label: 'Rascunho',   color: 'bg-gray-100 text-gray-600' },
  privado:   { label: 'Privado',    color: 'bg-gray-100 text-gray-500' },
  publico:   { label: 'Publicada',  color: 'bg-green-50 text-green-700' },
  reservado: { label: 'Reservada',  color: 'bg-amber-50 text-amber-700' },
  vendido:   { label: 'Vendida',    color: 'bg-blue-50 text-blue-700' },
  arquivado: { label: 'Arquivada',  color: 'bg-red-50 text-red-700' },
}

export default async function AdminPiecesPage() {
  const pieces = await getAdminPieces()

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
          Acervo <span className="text-[--color-ink-subtle] text-[1.25rem]">({pieces.length})</span>
        </h1>
        <Link
          href="/admin/pecas/nova"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-5 py-2.5 transition-colors"
        >
          + Nova peça
        </Link>
      </div>

      {pieces.length === 0 ? (
        <div className="border border-dashed border-[--color-border] p-16 text-center">
          <p className="font-body text-[13px] text-[--color-ink-subtle] mb-4">
            Nenhuma peça cadastrada ainda.
          </p>
          <Link
            href="/admin/pecas/nova"
            className="font-body text-[12px] uppercase tracking-[0.1em] text-[--color-accent] underline underline-offset-4"
          >
            Cadastrar primeira peça
          </Link>
        </div>
      ) : (
        <div className="border border-[--color-border] divide-y divide-[--color-border]">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-[64px_1fr_180px_120px_120px_100px] gap-4 px-5 py-3 bg-[--color-surface]">
            {['', 'Título / Artista', 'Categoria', 'Preço', 'Status', ''].map((h) => (
              <span key={h} className="font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle]">
                {h}
              </span>
            ))}
          </div>

          {pieces.map((piece) => {
            const primaryImage = piece.piece_images?.find((img: { is_primary: boolean }) => img.is_primary) ?? piece.piece_images?.[0]
            const status = STATUS_LABELS[piece.status ?? 'draft'] ?? STATUS_LABELS['draft']!
            const artist = Array.isArray(piece.artists) ? piece.artists[0] : piece.artists

            return (
              <div
                key={piece.id}
                className="grid grid-cols-[64px_1fr] lg:grid-cols-[64px_1fr_180px_120px_120px_100px] gap-4 items-center px-5 py-3 hover:bg-[--color-surface] transition-colors"
              >
                {/* Thumb */}
                <div className="w-14 h-14 bg-[--color-border] relative overflow-hidden shrink-0">
                  {primaryImage && (
                    <Image
                      src={(primaryImage as { url_original: string }).url_original}
                      alt={piece.title_pt}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>

                {/* Title + artist */}
                <div className="min-w-0">
                  <p className="font-body text-[13px] text-[--color-ink] truncate">{piece.title_pt}</p>
                  <p className="font-body text-[11px] text-[--color-ink-subtle]">
                    {artist?.name ?? '—'}
                    {piece.year_created && ` · ${piece.year_created}`}
                  </p>
                </div>

                {/* Category (hidden on mobile) */}
                <span className="hidden lg:block font-body text-[11px] text-[--color-ink-subtle] capitalize">
                  {piece.category ?? '—'}
                </span>

                {/* Price */}
                <span className="hidden lg:block font-body text-[12px] text-[--color-ink]">
                  {piece.price_brl ? formatBRL(piece.price_brl) : '—'}
                </span>

                {/* Status */}
                <span className={`hidden lg:inline-flex items-center px-2.5 py-1 text-[10px] font-body uppercase tracking-[0.08em] w-fit ${status.color}`}>
                  {status.label}
                </span>

                {/* Edit link */}
                <Link
                  href={`/admin/pecas/${piece.id}`}
                  className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:underline shrink-0"
                >
                  Editar
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
