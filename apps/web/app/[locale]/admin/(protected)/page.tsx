import { Suspense } from 'react'
import Link from 'next/link'
import { getAdminKPIs } from '../../../../lib/queries/admin'

export const metadata = { title: 'Dashboard' }

function KPICard({ label, value, sub, href }: { label: string; value: number | string; sub?: string; href?: string }) {
  const content = (
    <div className="border border-[--color-border] p-6 hover:border-[--color-accent]/40 transition-colors">
      <p className="font-body text-[10px] uppercase tracking-[0.12em] text-[--color-ink-subtle] mb-3">
        {label}
      </p>
      <p className="font-display text-[2rem] font-light text-[--color-ink] leading-none mb-1">
        {value}
      </p>
      {sub && (
        <p className="font-body text-[11px] text-[--color-ink-subtle]">{sub}</p>
      )}
    </div>
  )

  if (href) {
    return <Link href={href as Parameters<typeof Link>[0]['href']}>{content}</Link>
  }
  return content
}

async function KPIs() {
  const kpis = await getAdminKPIs()

  const cards = [
    { label: 'Peças no acervo', value: kpis.totalPieces, sub: `${kpis.publishedPieces} publicadas`, href: '/admin/pecas' },
    { label: 'Artistas', value: kpis.totalArtists, href: '/admin/artistas' },
    { label: 'Leads em aberto', value: kpis.openLeads, href: '/admin/leads' },
    { label: 'Viewing rooms ativos', value: kpis.activeViewingRooms, href: '/admin/viewing-rooms' },
  ]

  return (
    <>
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <KPICard key={c.label} {...c} />
        ))}
      </div>

      {/* Recent leads */}
      {kpis.recentLeads.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[1.125rem] font-light text-[--color-ink]">
              Leads recentes
            </h2>
            <Link
              href="/admin/leads"
              className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="border border-[--color-border] divide-y divide-[--color-border]">
            {kpis.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-body text-[13px] text-[--color-ink]">{lead.name}</p>
                  <p className="font-body text-[11px] text-[--color-ink-subtle]">
                    {lead.email}
                    {lead.piece_title && (
                      <span className="ml-2 text-[--color-ink-subtle]">· {lead.piece_title}</span>
                    )}
                  </p>
                </div>
                <time className="font-body text-[10px] text-[--color-ink-subtle] shrink-0 ml-4">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'short'
                  })}
                </time>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default function AdminDashboard() {
  return (
    <div className="max-w-[900px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
            Dashboard
          </h1>
          <p className="font-body text-[12px] text-[--color-ink-subtle] mt-1">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <Link
          href="/admin/pecas/nova"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-5 py-2.5 transition-colors"
        >
          + Nova peça
        </Link>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-[--color-border] p-6 animate-pulse">
              <div className="h-3 w-24 bg-[--color-border] mb-4"/>
              <div className="h-8 w-16 bg-[--color-border]"/>
            </div>
          ))}
        </div>
      }>
        <KPIs />
      </Suspense>
    </div>
  )
}
