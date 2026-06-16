import Link from 'next/link'
import { ArtistForm } from '../../../../../components/admin/ArtistForm'

export const metadata = { title: 'Novo Artista' }

export default function NewArtistPage() {
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
        <h1 className="font-display text-[1.5rem] font-light text-[--color-ink]">
          Novo artista
        </h1>
      </div>

      <ArtistForm />
    </div>
  )
}
