import { getAdminSourcingLeads } from '../../../../../lib/queries/admin'
import { SourcingLeadsTable } from '../../../../../components/admin/SourcingLeadsTable'

export const metadata = { title: 'Sourcing' }

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminSourcingPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr ?? 1))
  const PAGE_SIZE = 50

  const { data: leads, count } = await getAdminSourcingLeads(page, PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
            Sourcing
          </h1>
          <p className="font-body text-[11px] text-[--color-ink-subtle] mt-1">
            Solicitações de venda de obras · {count} total
          </p>
        </div>
      </div>

      <SourcingLeadsTable leads={leads} page={page} totalPages={totalPages} />
    </div>
  )
}
