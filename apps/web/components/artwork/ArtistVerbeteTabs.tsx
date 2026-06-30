import { MarkdownContent } from '../content/MarkdownContent'
import { formatBRL } from '../../lib/format'
import type { ArtistComparable } from '../../lib/queries/artists'

interface ArtistVerbeteTabsProps {
  biografia: string
  mercado: string
  comparables: ArtistComparable[]
}

const TAB_LABEL_CLASS =
  'artist-verbete-tab font-body font-medium uppercase tracking-caps text-eyebrow px-4 py-3 -mb-px border-b-2 border-transparent cursor-pointer text-ink-700 hover:text-bronze-500 transition-colors duration-base'

export function ArtistVerbeteTabs({ biografia, mercado, comparables }: ArtistVerbeteTabsProps) {
  return (
    <section aria-labelledby="verbete-heading" className="mb-16 artist-verbete-tabs">
      <p
        id="verbete-heading"
        className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-6"
      >
        Verbete curatorial
      </p>

      <input
        type="radio"
        name="artist-verbete"
        id="artist-verbete-biografia"
        defaultChecked
        className="sr-only"
      />
      <input type="radio" name="artist-verbete" id="artist-verbete-mercado" className="sr-only" />
      <input type="radio" name="artist-verbete" id="artist-verbete-referencias" className="sr-only" />

      <div
        role="tablist"
        aria-label="Seções do verbete"
        className="flex flex-wrap gap-2 mb-8 border-b border-cream-200"
      >
        <label htmlFor="artist-verbete-biografia" role="tab" className={TAB_LABEL_CLASS}>
          Biografia
        </label>
        <label htmlFor="artist-verbete-mercado" role="tab" className={TAB_LABEL_CLASS}>
          Mercado
        </label>
        <label htmlFor="artist-verbete-referencias" role="tab" className={TAB_LABEL_CLASS}>
          Referências
        </label>
      </div>

      <div role="tabpanel" className="artist-verbete-panel artist-verbete-panel--biografia">
        <MarkdownContent content={biografia} variant="editorial" />
      </div>

      <div role="tabpanel" className="artist-verbete-panel artist-verbete-panel--mercado">
        {mercado ? (
          <MarkdownContent content={mercado} variant="editorial" />
        ) : (
          <p className="font-body text-body text-ink-700">Conteúdo de mercado em preparação.</p>
        )}
      </div>

      <div role="tabpanel" className="artist-verbete-panel artist-verbete-panel--referencias">
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
    </section>
  )
}
