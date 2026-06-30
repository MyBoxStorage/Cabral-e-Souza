import Link from 'next/link'
import { ACERVO_PAGE_SIZE, buildAcervoQuery, type AcervoSearchParams } from '../../lib/acervo'

interface AcervoPaginationProps {
  params: AcervoSearchParams
  totalCount: number
  page: number
}

export function AcervoPagination({ params, totalCount, page }: AcervoPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / ACERVO_PAGE_SIZE))
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-4 mt-12">
      {page > 1 && (
        <Link
          href={`/acervo${buildAcervoQuery(params, { pagina: String(page - 1) })}`}
          className="font-body font-medium uppercase tracking-caps text-eyebrow text-ink-800 border border-ink-800 hover:bg-ink-800 hover:text-cream-100 px-6 py-3 rounded-md transition-colors duration-base"
        >
          ← Anterior
        </Link>
      )}
      <span className="font-body text-caption text-ink-700">
        Página {page} de {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={`/acervo${buildAcervoQuery(params, { pagina: String(page + 1) })}`}
          className="font-body font-medium uppercase tracking-caps text-eyebrow text-ink-800 border border-ink-800 hover:bg-ink-800 hover:text-cream-100 px-6 py-3 rounded-md transition-colors duration-base"
        >
          Próxima →
        </Link>
      )}
    </nav>
  )
}
