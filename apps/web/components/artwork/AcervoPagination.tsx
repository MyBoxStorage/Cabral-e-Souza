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
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-paper] px-6 py-3 transition-colors"
        >
          ← Anterior
        </Link>
      )}
      <span className="font-body text-[12px] text-[--color-ink-subtle]">
        Página {page} de {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={`/acervo${buildAcervoQuery(params, { pagina: String(page + 1) })}`}
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-paper] px-6 py-3 transition-colors"
        >
          Próxima →
        </Link>
      )}
    </nav>
  )
}
