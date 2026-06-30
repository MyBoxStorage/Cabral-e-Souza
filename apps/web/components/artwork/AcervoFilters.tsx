'use client'

import Link from 'next/link'
import {
  ACERVO_SORT_OPTIONS,
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
  const activeSort = params.ordenar ?? 'recente'

  return (
    <section className="border-b border-cream-200 py-6 bg-cream-100">
      <div className="container-default flex flex-col gap-5">
        <form
          method="get"
          action="/acervo"
          className="flex flex-col lg:flex-row gap-3"
          role="search"
        >
          {params.colecao && <input type="hidden" name="colecao" value={params.colecao} />}
          {params.categoria && <input type="hidden" name="categoria" value={params.categoria} />}
          {params.ordenar && params.ordenar !== 'recente' && (
            <input type="hidden" name="ordenar" value={params.ordenar} />
          )}

          <label htmlFor="acervo-busca" className="sr-only">
            Buscar obras
          </label>
          <input
            id="acervo-busca"
            name="busca"
            type="search"
            defaultValue={params.busca ?? ''}
            placeholder="Buscar por título..."
            className="flex-1 font-body text-body border-0 border-b border-bronze-500/30 bg-transparent px-1 py-3 text-ink-800 placeholder:text-ink-700/50 placeholder:italic focus:outline-none focus:border-bronze-700 transition-colors"
          />

          <label htmlFor="acervo-artista" className="sr-only">
            Filtrar por artista
          </label>
          <select
            id="acervo-artista"
            name="artista"
            defaultValue={params.artista ?? ''}
            className="font-body text-body-sm border-0 border-b border-bronze-500/30 bg-transparent px-1 py-3 text-ink-800 focus:outline-none focus:border-bronze-700 lg:min-w-[200px]"
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
            className="font-body font-medium uppercase tracking-caps text-eyebrow text-cream-100 bg-bronze-500 hover:bg-bronze-700 px-6 py-3 rounded-md transition-colors duration-base"
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
                'shrink-0 font-body font-medium uppercase tracking-caps text-eyebrow px-4 py-2 rounded-sm border transition-colors duration-base',
                activeCategory === cat.value
                  ? 'border-bronze-500 bg-bronze-500 text-cream-100'
                  : 'border-bronze-500/30 text-ink-800 hover:border-bronze-500 hover:text-bronze-500',
              ].join(' ')}
              aria-current={activeCategory === cat.value ? 'page' : undefined}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="acervo-ordenar" className="font-body text-caption text-ink-700 shrink-0">
            Ordenar:
          </label>
          <select
            id="acervo-ordenar"
            defaultValue={activeSort}
            onChange={(e) => {
              window.location.href = `/acervo${buildAcervoQuery(params, { ordenar: e.target.value, clearPagina: true })}`
            }}
            className="font-body text-body-sm border-0 border-b border-bronze-500/30 bg-transparent px-1 py-2 text-ink-800 focus:outline-none focus:border-bronze-700"
          >
            {ACERVO_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
