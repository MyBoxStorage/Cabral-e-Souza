'use client'

import { useState, useTransition } from 'react'
import { createViewingRoom, toggleViewingRoom } from '../../app/actions/viewing-room'

interface Piece {
  id: string
  title: string
  artist_name: string | null
  thumbnail: string | null
}

interface ViewingRoom {
  id: string
  token: string
  is_active: boolean
  expires_at: string
  client_name: string
  client_email: string | null
  notes_internal: string | null
}

interface Props {
  pieces: Piece[]
  viewingRooms: ViewingRoom[]
  siteUrl: string
}

export function ViewingRoomGenerator({ pieces, viewingRooms, siteUrl }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function togglePiece(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setCreatedLink(null)

    if (selectedIds.size === 0) {
      setError('Selecione pelo menos uma peça.')
      return
    }

    const fd = new FormData(e.currentTarget)
    fd.set('piece_ids', Array.from(selectedIds).join(','))

    startTransition(async () => {
      try {
        const result = await createViewingRoom(fd)
        const link = `${siteUrl}/viewing/${result.token}`
        setCreatedLink(link)
        setSelectedIds(new Set())
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao criar')
      }
    })
  }

  async function copyLink(link: string, id: string) {
    await navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ─── Criar novo ─── */}
      <div>
        <h2 className="font-display text-[1.125rem] font-light text-[--color-ink] mb-5">
          Criar novo Viewing Room
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="border border-red-200 bg-red-50 p-3">
              <p className="font-body text-[12px] text-red-700">{error}</p>
            </div>
          )}

          {createdLink && (
            <div className="border border-green-200 bg-green-50 p-4">
              <p className="font-body text-[11px] uppercase tracking-[0.08em] text-green-700 mb-2">
                Link criado com sucesso!
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={createdLink}
                  className="flex-1 font-body text-[12px] text-[--color-ink] border border-green-200 bg-white px-2 py-1.5 outline-none select-all"
                />
                <button
                  type="button"
                  onClick={() => copyLink(createdLink, 'new')}
                  className="font-body text-[10px] uppercase tracking-[0.08em] text-green-700 border border-green-300 px-3 py-1.5 hover:bg-green-100 transition-colors whitespace-nowrap"
                >
                  {copiedId === 'new' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
                Nome do cliente <span className="text-[--color-accent]">*</span>
              </label>
              <input
                name="client_name"
                required
                placeholder="ex: Sr. Mendonça"
                className="w-full border border-[--color-border] focus:border-[--color-accent] font-body text-[13px] px-3 py-2 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
                Email do cliente
              </label>
              <input
                name="client_email"
                type="email"
                className="w-full border border-[--color-border] focus:border-[--color-accent] font-body text-[13px] px-3 py-2 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
              Mensagem personalizada (visível ao cliente)
            </label>
            <textarea
              name="message_pt"
              rows={3}
              className="w-full border border-[--color-border] focus:border-[--color-accent] font-body text-[13px] px-3 py-2 outline-none transition-colors resize-y"
              placeholder="Olá! Separei algumas obras..."
            />
          </div>

          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
              Expirar em (dias)
            </label>
            <input
              name="expires_in_days"
              type="number"
              defaultValue={7}
              min={1}
              max={90}
              className="w-24 border border-[--color-border] focus:border-[--color-accent] font-body text-[13px] px-3 py-2 outline-none transition-colors"
            />
          </div>

          {/* Seletor de peças */}
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-3">
              Peças selecionadas ({selectedIds.size})
            </p>
            <div className="border border-[--color-border] max-h-[280px] overflow-y-auto divide-y divide-[--color-border]">
              {pieces.map((piece) => (
                <label
                  key={piece.id}
                  className={[
                    'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                    selectedIds.has(piece.id) ? 'bg-[--color-accent]/5' : 'hover:bg-[--color-surface]',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(piece.id)}
                    onChange={() => togglePiece(piece.id)}
                    className="w-4 h-4 accent-[--color-accent] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-body text-[12px] text-[--color-ink] truncate">{piece.title}</p>
                    {piece.artist_name && (
                      <p className="font-body text-[10px] text-[--color-ink-subtle]">{piece.artist_name}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || selectedIds.size === 0}
            className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-8 py-3 transition-colors disabled:opacity-40"
          >
            {isPending ? 'Gerando link...' : 'Gerar link'}
          </button>
        </form>
      </div>

      {/* ─── Histórico ─── */}
      <div>
        <h2 className="font-display text-[1.125rem] font-light text-[--color-ink] mb-5">
          Viewing Rooms criados
        </h2>

        {viewingRooms.length === 0 ? (
          <div className="border border-dashed border-[--color-border] p-10 text-center">
            <p className="font-body text-[12px] text-[--color-ink-subtle]">
              Nenhum viewing room criado ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {viewingRooms.map((vr) => {
              const link = `${siteUrl}/viewing/${vr.token}`
              const expired = new Date(vr.expires_at) < new Date()

              return (
                <div
                  key={vr.id}
                  className={[
                    'border p-4',
                    vr.is_active && !expired
                      ? 'border-[--color-border]'
                      : 'border-[--color-border] opacity-50',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-body text-[13px] text-[--color-ink] truncate">{vr.client_name}</p>
                      {vr.client_email && (
                        <p className="font-body text-[11px] text-[--color-ink-subtle]">
                          {vr.client_email}
                        </p>
                      )}
                      <p className="font-body text-[10px] text-[--color-ink-subtle] mt-1">
                        Expira:{' '}
                        {new Date(vr.expires_at).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                        {expired && ' · EXPIRADO'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyLink(link, vr.id)}
                        className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-accent] border border-[--color-accent]/30 px-3 py-1 hover:bg-[--color-accent]/5 transition-colors"
                      >
                        {copiedId === vr.id ? 'Copiado!' : 'Copiar link'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          startTransition(async () => {
                            await toggleViewingRoom(vr.id, !vr.is_active)
                          })
                        }}
                        className="font-body text-[10px] uppercase tracking-[0.08em] text-[--color-ink-subtle] border border-[--color-border] px-3 py-1 hover:border-[--color-ink-subtle] transition-colors"
                      >
                        {vr.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
