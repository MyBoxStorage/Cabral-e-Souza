import Link from 'next/link'
import {
  buildAcervoQuery,
  PIECE_CATEGORIES,
  type AcervoSearchParams,
} from '../../lib/acervo'
import type { ArtistListItem } from '../../lib/queries/artists'

interface AcervoFiltersProps {
  params: AcervoSearchParams
  artists: ArtistListItem[]
}

export function AcervoFilters({ params, artists }: AcervoFiltersProps) {
  const activeCategory = params.categoria ?? ''

  return (
    <section className="border-b border-[--color-paper-deep] py-4">
      <div className="container-default flex flex-col gap-4">
        <form
          method="get"
          action="/acervo"
          className="flex flex-col sm:flex-row gap-3"
          role="search"
        >
          {params.categoria && <input type="hidden" name="categoria" value={params.categoria} />}
          <label htmlFor="acervo-busca" className="sr-only">
            Buscar obras
          </label>
          <input
            id="acervo-busca"
            name="busca"
            type="search"
            defaultValue={params.busca ?? ''}
            placeholder="Buscar por título..."
            className="flex-1 font-body text-[14px] border border-[--color-paper-deep] bg-[--color-paper] px-4 py-3 text-[--color-ink] focus:outline-none focus:border-[--color-accent]"
          />
          <label htmlFor="acervo-artista" className="sr-only">
            Filtrar por artista
          </label>
          <select
            id="acervo-artista"
            name="artista"
            defaultValue={params.artista ?? ''}
            className="font-body text-[14px] border border-[--color-paper-deep] bg-[--color-paper] px-4 py-3 text-[--color-ink] focus:outline-none focus:border-[--color-accent] sm:min-w-[200px]"
          >
            <option value="">Todos os artistas</option>
            {artists.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-6 py-3 transition-colors duration-200"
          >
            Filtrar
          </button>
        </form>

        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          role="navigation"
          aria-label="Filtrar por categoria"
        >
          {PIECE_CATEGORIES.map((cat) => (
            <Link
              key={cat.value || 'all'}
              href={`/acervo${buildAcervoQuery(params, { categoria: cat.value || undefined, clearPagina: true })}`}
              className={[
                'flex-shrink-0 font-body text-[11px] uppercase tracking-[0.1em] px-4 py-2 border transition-colors duration-200',
                activeCategory === cat.value
                  ? 'border-[--color-ink] bg-[--color-ink] text-[--color-paper]'
                  : 'border-[--color-paper-deep] text-[--color-ink-muted] hover:border-[--color-ink] hover:text-[--color-ink]',
              ].join(' ')}
              aria-current={activeCategory === cat.value ? 'page' : undefined}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
