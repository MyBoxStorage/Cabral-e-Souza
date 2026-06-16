import Link from 'next/link'
import { PieceForm } from '../../../../../components/admin/PieceForm'
import { getAdminArtists } from '../../../../../lib/queries/admin'

export const metadata = { title: 'Nova Peça' }

export default async function NewPiecePage() {
  const artists = await getAdminArtists()

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
        <h1 className="font-display text-[1.5rem] font-light text-[--color-ink]">
          Nova peça
        </h1>
      </div>

      <PieceForm
        artists={artists.map((a) => ({ id: a.id, name: a.name }))}
      />
    </div>
  )
}
