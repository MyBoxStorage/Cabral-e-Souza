'use client'

import { useState } from 'react'
import { MarkdownContent } from '../content/MarkdownContent'
import { formatBRL } from '../../lib/format'
import type { ArtistComparable } from '../../lib/queries/artists'

type TabId = 'biografia' | 'mercado' | 'referencias'

interface ArtistVerbeteTabsProps {
  biografia: string
  mercado: string
  comparables: ArtistComparable[]
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'biografia', label: 'Biografia' },
  { id: 'mercado', label: 'Mercado' },
  { id: 'referencias', label: 'Referências' },
]

export function ArtistVerbeteTabs({ biografia, mercado, comparables }: ArtistVerbeteTabsProps) {
  const [active, setActive] = useState<TabId>('biografia')

  return (
    <section aria-labelledby="verbete-heading" className="mb-16">
      <p
        id="verbete-heading"
        className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-6"
      >
        Verbete curatorial
      </p>

      <div
        role="tablist"
        aria-label="Seções do verbete"
        className="flex flex-wrap gap-2 mb-8 border-b border-cream-200"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={[
              'font-body font-medium uppercase tracking-caps text-eyebrow px-4 py-3 -mb-px border-b-2 transition-colors duration-base',
              active === tab.id
                ? 'border-bronze-500 text-bronze-500'
                : 'border-transparent text-ink-700 hover:text-bronze-500',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'biografia' && (
        <div role="tabpanel">
          <MarkdownContent content={biografia} variant="editorial" dropcap />
        </div>
      )}

      {active === 'mercado' && (
        <div role="tabpanel">
          {mercado ? (
            <MarkdownContent content={mercado} variant="editorial" />
          ) : (
            <p className="font-body text-body text-ink-700">Conteúdo de mercado em preparação.</p>
          )}
        </div>
      )}

      {active === 'referencias' && (
        <div role="tabpanel">
          {comparables.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-body-sm">
                <thead>
                  <tr className="border-b border-bronze-500/30">
                    {['Data', 'Casa', 'Obra', 'Valor'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="py-3 pr-4 text-left font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparables.map((c) => (
                    <tr key={c.id} className="border-b border-cream-200">
                      <td className="py-3 pr-4 font-body text-ink-700">
                        {new Date(c.auction_date).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-3 pr-4 font-body text-ink-800">{c.auction_house}</td>
                      <td className="py-3 pr-4 font-display italic text-ink-800">
                        {c.work_title ?? '—'}
                        {c.work_year != null ? ` (${c.work_year})` : ''}
                      </td>
                      <td className="py-3 pr-4 font-body text-bronze-700">
                        {c.hammer_price
                          ? `${c.currency ?? ''} ${c.hammer_price.toLocaleString('pt-BR')}${
                              c.currency_at_brl ? ` · ≈ ${formatBRL(Number(c.currency_at_brl))}` : ''
                            }`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="font-body text-body text-ink-700">
              Referências de leilão serão publicadas em breve.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
