'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { updateLeadStatus } from '../../app/actions/lead'

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string | null
  notes_internal: string | null
  status: string | null
  source: string | null
  created_at: string
  pieces?: { id: string; title_pt: string; slug: string } | { id: string; title_pt: string; slug: string }[] | null
}

const STATUS_OPTIONS = ['novo', 'qualificado', 'em_negociacao', 'ganho', 'perdido', 'descartado'] as const
type LeadStatus = (typeof STATUS_OPTIONS)[number]

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  novo:          { label: 'Novo',          color: 'bg-blue-50 text-blue-700' },
  qualificado:   { label: 'Qualificado',   color: 'bg-amber-50 text-amber-700' },
  em_negociacao: { label: 'Negociando',    color: 'bg-purple-50 text-purple-700' },
  ganho:         { label: 'Ganho ✓',      color: 'bg-green-50 text-green-700' },
  perdido:       { label: 'Perdido',       color: 'bg-gray-100 text-gray-500' },
  descartado:    { label: 'Descartado',    color: 'bg-red-50 text-red-600' },
}

function LeadRow({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const currentStatus = (lead.status as LeadStatus) ?? 'novo'
  const statusInfo = STATUS_LABELS[currentStatus] ?? STATUS_LABELS['novo']

  function changeStatus(next: LeadStatus) {
    startTransition(async () => {
      await updateLeadStatus(lead.id, next)
    })
  }

  return (
    <>
      <tr
        className="border-b border-[--color-border] hover:bg-[--color-surface] cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          <p className="font-body text-[13px] text-[--color-ink]">{lead.name}</p>
          <p className="font-body text-[11px] text-[--color-ink-subtle]">{lead.email}</p>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          {lead.pieces && !Array.isArray(lead.pieces) ? (
            <Link
              href={`/admin/pecas/${(lead.pieces as { id: string; title_pt: string }).id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-body text-[12px] text-[--color-accent] hover:underline"
            >
              {(lead.pieces as { id: string; title_pt: string }).title_pt}
            </Link>
          ) : (
            <span className="font-body text-[11px] text-[--color-ink-subtle]">—</span>
          )}
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="font-body text-[10px] text-[--color-ink-subtle] uppercase tracking-[0.06em]">
            {lead.source ?? '—'}
          </span>
        </td>
        <td className="px-4 py-3">
          <select
            value={currentStatus}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => changeStatus(e.target.value as LeadStatus)}
            disabled={isPending}
            className={[
              'font-body text-[10px] uppercase tracking-[0.06em] px-2 py-1 border-0 outline-none cursor-pointer',
              statusInfo.color,
            ].join(' ')}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-right hidden sm:table-cell">
          <time className="font-body text-[11px] text-[--color-ink-subtle]">
            {new Date(lead.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'short', year: '2-digit'
            })}
          </time>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-[--color-surface]">
          <td colSpan={5} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
              {lead.phone && (
                <div>
                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">Telefone</span>
                  <p className="font-body text-[--color-ink] mt-0.5">
                    <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[--color-accent] hover:underline">
                      {lead.phone}
                    </a>
                  </p>
                </div>
              )}
              {lead.notes_internal && (
                <div className="sm:col-span-2">
                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">Notas</span>
                  <p className="font-body text-[--color-ink] mt-0.5 whitespace-pre-wrap">{lead.notes_internal}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

interface LeadsTableProps {
  leads: Lead[]
  page: number
  totalPages: number
}

export function LeadsTable({ leads, page, totalPages }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="border border-dashed border-[--color-border] p-16 text-center">
        <p className="font-body text-[13px] text-[--color-ink-subtle]">
          Nenhum lead cadastrado ainda.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border border-[--color-border] overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[--color-surface] border-b border-[--color-border]">
              {['Contato', 'Peça', 'Origem', 'Status', 'Data'].map((h, i) => (
                <th
                  key={h}
                  className={[
                    'px-4 py-3 font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] text-left',
                    i === 1 ? 'hidden md:table-cell' : '',
                    i === 2 ? 'hidden lg:table-cell' : '',
                    i === 4 ? 'hidden sm:table-cell text-right' : '',
                  ].join(' ')}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Link
            href={`?page=${page - 1}`}
            className={[
              'font-body text-[11px] uppercase tracking-[0.1em] px-4 py-2 border border-[--color-border] transition-colors',
              page <= 1 ? 'opacity-30 pointer-events-none' : 'hover:border-[--color-accent] text-[--color-ink]',
            ].join(' ')}
          >
            ← Anterior
          </Link>
          <span className="font-body text-[12px] text-[--color-ink-subtle]">
            {page} / {totalPages}
          </span>
          <Link
            href={`?page=${page + 1}`}
            className={[
              'font-body text-[11px] uppercase tracking-[0.1em] px-4 py-2 border border-[--color-border] transition-colors',
              page >= totalPages ? 'opacity-30 pointer-events-none' : 'hover:border-[--color-accent] text-[--color-ink]',
            ].join(' ')}
          >
            Próxima →
          </Link>
        </div>
      )}
    </>
  )
}
