'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import {
  updateSourcingLeadStatus,
  type SourcingLeadStatus,
} from '../../app/actions/sourcing-admin'
import type { AdminSourcingLead } from '../../lib/queries/admin'

const STATUS_OPTIONS = [
  'aguardando_analise',
  'em_pesquisa',
  'proposta_enviada',
  'aceita',
  'recusada',
  'inviavel',
  'arquivado',
] as const satisfies readonly SourcingLeadStatus[]

const STATUS_LABELS: Record<SourcingLeadStatus, { label: string; color: string }> = {
  aguardando_analise: { label: 'Aguardando', color: 'bg-blue-50 text-blue-700' },
  em_pesquisa: { label: 'Em pesquisa', color: 'bg-amber-50 text-amber-700' },
  proposta_enviada: { label: 'Proposta enviada', color: 'bg-purple-50 text-purple-700' },
  aceita: { label: 'Aceita', color: 'bg-green-50 text-green-700' },
  recusada: { label: 'Recusada', color: 'bg-red-50 text-red-600' },
  inviavel: { label: 'Inviável', color: 'bg-gray-100 text-gray-600' },
  arquivado: { label: 'Arquivado', color: 'bg-gray-100 text-gray-500' },
}

const TECHNIQUE_LABELS: Record<string, string> = {
  pintura: 'Pintura',
  escultura: 'Escultura',
  desenho: 'Desenho',
  gravura: 'Gravura',
  fotografia: 'Fotografia',
  objeto: 'Objeto',
  antiguidade: 'Antiguidade',
}

function valueRangeLabel(notes: string | null, expected: number | null): string {
  if (notes?.includes('ate_20k')) return 'Até R$ 20 mil'
  if (notes?.includes('20_80k')) return 'R$ 20–80 mil'
  if (notes?.includes('80_300k')) return 'R$ 80–300 mil'
  if (notes?.includes('300k_mais')) return 'Acima de R$ 300 mil'
  if (notes?.includes('nao_sei')) return 'Não informado'
  if (expected != null) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(expected)
  }
  return '—'
}

function whatsAppHref(phone: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const normalized = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${normalized}`
}

function PhotoLightbox({
  photos,
  activeIndex,
  onClose,
  onNavigate,
}: {
  photos: { signedUrl: string }[]
  activeIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const photo = photos[activeIndex]
  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="Visualização de foto"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 font-body text-[11px] uppercase tracking-wider text-white/70 hover:text-white"
      >
        Fechar ✕
      </button>
      {photos.length > 1 && activeIndex > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1) }}
          className="absolute left-4 text-white/70 hover:text-white text-2xl"
          aria-label="Foto anterior"
        >
          ‹
        </button>
      )}
      <img
        src={photo.signedUrl}
        alt={`Foto ${activeIndex + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {photos.length > 1 && activeIndex < photos.length - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1) }}
          className="absolute right-4 text-white/70 hover:text-white text-2xl"
          aria-label="Próxima foto"
        >
          ›
        </button>
      )}
      <p className="absolute bottom-4 font-body text-[12px] text-white/60">
        {activeIndex + 1} / {photos.length}
      </p>
    </div>
  )
}

function SourcingLeadRow({ lead }: { lead: AdminSourcingLead }) {
  const [expanded, setExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const currentStatus = (lead.status as SourcingLeadStatus) ?? 'aguardando_analise'
  const statusInfo = STATUS_LABELS[currentStatus] ?? STATUS_LABELS.aguardando_analise
  const waLink = whatsAppHref(lead.seller_phone)

  function changeStatus(next: SourcingLeadStatus) {
    startTransition(async () => {
      await updateSourcingLeadStatus(lead.id, next)
    })
  }

  return (
    <>
      <tr
        className="border-b border-[--color-border] hover:bg-[--color-surface] cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 hidden sm:table-cell">
          <time className="font-body text-[11px] text-[--color-ink-subtle]">
            {new Date(lead.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'short', year: '2-digit',
            })}
          </time>
        </td>
        <td className="px-4 py-3">
          <p className="font-body text-[13px] text-[--color-ink]">{lead.seller_name}</p>
          <p className="font-body text-[11px] text-[--color-ink-subtle] sm:hidden">
            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
          </p>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <p className="font-body text-[12px] text-[--color-ink]">{lead.seller_email ?? '—'}</p>
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-body text-[11px] text-[--color-accent] hover:underline"
            >
              {lead.seller_phone}
            </a>
          ) : (
            <p className="font-body text-[11px] text-[--color-ink-subtle]">{lead.seller_phone ?? '—'}</p>
          )}
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="font-body text-[12px] text-[--color-ink]">
            {TECHNIQUE_LABELS[lead.technique_claimed ?? ''] ?? lead.technique_claimed ?? '—'}
          </span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="font-body text-[12px] text-[--color-ink]">
            {lead.artist_claimed ?? '—'}
          </span>
        </td>
        <td className="px-4 py-3 hidden xl:table-cell">
          <span className="font-body text-[11px] text-[--color-ink-muted]">
            {valueRangeLabel(lead.notes_internal, lead.expected_value_brl)}
          </span>
        </td>
        <td className="px-4 py-3">
          <select
            value={currentStatus}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => changeStatus(e.target.value as SourcingLeadStatus)}
            disabled={isPending}
            className={[
              'font-body text-[10px] uppercase tracking-[0.06em] px-2 py-1 border-0 outline-none cursor-pointer max-w-[140px]',
              statusInfo.color,
            ].join(' ')}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
            ))}
          </select>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-[--color-surface]">
          <td colSpan={7} className="px-4 pb-6 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[12px]">
              <div className="space-y-4">
                <div>
                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">Contato</span>
                  <p className="font-body text-[--color-ink] mt-1">{lead.seller_email}</p>
                  {waLink ? (
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-body text-[--color-accent] hover:underline">
                      WhatsApp: {lead.seller_phone}
                    </a>
                  ) : (
                    <p className="font-body text-[--color-ink]">{lead.seller_phone}</p>
                  )}
                  <p className="font-body text-[--color-ink-subtle] mt-0.5">{lead.seller_city}</p>
                </div>
                <div>
                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">Obra</span>
                  <p className="font-body text-[--color-ink] mt-1">
                    {TECHNIQUE_LABELS[lead.technique_claimed ?? ''] ?? lead.technique_claimed}
                    {lead.artist_claimed ? ` · ${lead.artist_claimed}` : ''}
                  </p>
                  {lead.dimensions_claimed && (
                    <p className="font-body text-[--color-ink-subtle]">{lead.dimensions_claimed}</p>
                  )}
                </div>
                <div>
                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">Histórico de aquisição</span>
                  <p className="font-body text-[--color-ink] mt-1 whitespace-pre-wrap leading-relaxed">
                    {lead.acquisition_history ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">Atualizado em</span>
                  <p className="font-body text-[--color-ink] mt-0.5">
                    {new Date(lead.updated_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle]">
                    Fotos ({lead.photos.length})
                  </span>
                  <button
                    type="button"
                    disabled
                    title="Disponível quando o agente de proveniência estiver ativo"
                    className="font-body text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 border border-[--color-border] text-[--color-ink-subtle] opacity-50 cursor-not-allowed"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Rodar análise preliminar
                  </button>
                </div>
                {lead.photos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {lead.photos.map((photo, i) => (
                      <button
                        key={photo.path}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                        className="aspect-square overflow-hidden border border-[--color-border] bg-[--color-paper] hover:border-[--color-accent] transition-colors"
                      >
                        <img src={photo.signedUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-[12px] text-[--color-ink-subtle]">Nenhuma foto enviada.</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={lead.photos}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  )
}

interface SourcingLeadsTableProps {
  leads: AdminSourcingLead[]
  page: number
  totalPages: number
}

export function SourcingLeadsTable({ leads, page, totalPages }: SourcingLeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="border border-dashed border-[--color-border] p-16 text-center">
        <p className="font-body text-[13px] text-[--color-ink-subtle]">
          Nenhuma solicitação de sourcing ainda.
        </p>
      </div>
    )
  }

  const headers = ['Data', 'Nome', 'Contato', 'Tipo', 'Artista', 'Faixa', 'Status']

  return (
    <>
      <div className="border border-[--color-border] overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[--color-surface] border-b border-[--color-border]">
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={[
                    'px-4 py-3 font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] text-left',
                    i === 0 ? 'hidden sm:table-cell' : '',
                    i === 2 ? 'hidden md:table-cell' : '',
                    i === 3 || i === 4 ? 'hidden lg:table-cell' : '',
                    i === 5 ? 'hidden xl:table-cell' : '',
                  ].join(' ')}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <SourcingLeadRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>

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
