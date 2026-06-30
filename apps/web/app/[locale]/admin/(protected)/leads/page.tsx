import { getAdminLeads } from '../../../../../lib/queries/admin'
import { LeadsTable } from '../../../../../components/admin/LeadsTable'

export const metadata = { title: 'Leads' }

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr ?? 1))
  const PAGE_SIZE = 50

  const { data: leads, count } = await getAdminLeads(page, PAGE_SIZE)
  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div className="max-w-[1000px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
            Leads
          </h1>
          <p className="font-body text-[11px] text-[--color-ink-subtle] mt-1">
            {count} total
          </p>
        </div>
      </div>

      <LeadsTable leads={leads} page={page} totalPages={totalPages} />
    </div>
  )
}
