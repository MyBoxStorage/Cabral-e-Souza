'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { upsertPiece, uploadPieceImage, setPrimaryImage, deleteImage } from '../../app/actions/piece'

interface Artist { id: string; name: string }
interface PieceImage { id: string; url: string; is_primary: boolean; order: number }

interface PieceFormProps {
  pieceId?: string
  artists: Artist[]
  initialData?: Record<string, unknown>
  images?: PieceImage[]
}

const CATEGORIES = ['pintura', 'escultura', 'fotografia', 'gravura', 'desenho', 'instalacao', 'video', 'outro']
const STATUSES = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'privado', label: 'Privado' },
  { value: 'publico', label: 'Público' },
  { value: 'reservado', label: 'Reservada' },
  { value: 'vendido', label: 'Vendida' },
  { value: 'arquivado', label: 'Arquivada' },
]
const PRICE_VIS = [
  { value: 'public', label: 'Público' },
  { value: 'on_request', label: 'Sob consulta' },
  { value: 'hidden', label: 'Oculto' },
]
const ATTRIBUTIONS = [
  { value: 'autoria_confirmada', label: 'Autoria confirmada' },
  { value: 'atribuido_a', label: 'Atribuído a' },
  { value: 'circulo_de', label: 'Círculo de' },
  { value: 'escola_de', label: 'Escola de' },
  { value: 'seguidor_de', label: 'Seguidor de' },
  { value: 'oficina_de', label: 'Oficina de' },
  { value: 'desconhecido', label: 'Desconhecido' },
]

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
        {label}{required && <span className="text-[--color-accent] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-[--color-border] bg-white focus:border-[--color-accent] font-body text-[13px] text-[--color-ink] px-3 py-2 outline-none transition-colors'
const selectCls = `${inputCls} appearance-none`
const checkboxCls = 'w-4 h-4 border border-[--color-border] accent-[--color-accent] cursor-pointer'

export function PieceForm({ pieceId, artists, initialData = {}, images = [] }: PieceFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [uploadPending, setUploadPending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const d = initialData

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await upsertPiece(pieceId ?? null, fd)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !pieceId) return

    setUploadPending(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      await uploadPieceImage(pieceId, fd)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploadPending(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-[860px]">
      {error && (
        <div className="border border-red-200 bg-red-50 p-4">
          <p className="font-body text-[12px] text-red-700">{error}</p>
        </div>
      )}

      {/* ─── Identificação ─── */}
      <section>
        <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-4 pb-2 border-b border-[--color-border]">
          Identificação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Título (Português)" required>
            <input name="title_pt" required defaultValue={d['title_pt'] as string} className={inputCls} />
          </Field>
          <Field label="Slug" required>
            <input name="slug" required defaultValue={d['slug'] as string} pattern="[a-z0-9-]+" className={inputCls} placeholder="nome-da-obra" />
          </Field>
          <Field label="Código interno" required>
            <input name="internal_code" required defaultValue={d['internal_code'] as string} className={inputCls} placeholder="ex: CS-2024-001" />
          </Field>
          <Field label="Artista">
            <select name="artist_id" defaultValue={d['artist_id'] as string} className={selectCls}>
              <option value="">— Sem artista —</option>
              {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </Field>
          <Field label="Atribuição" required>
            <select name="attribution" required defaultValue={d['attribution'] as string ?? 'autoria_confirmada'} className={selectCls}>
              {ATTRIBUTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </Field>
          <Field label="Categoria" required>
            <select name="category" required defaultValue={d['category'] as string ?? 'pintura'} className={selectCls}>
              {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* ─── Ficha técnica CNART ─── */}
      <section>
        <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-4 pb-2 border-b border-[--color-border]">
          Ficha técnica <span className="font-body text-[11px] text-[--color-ink-subtle] ml-2">campos CNART</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Técnica (Português)">
            <input name="technique_pt" defaultValue={d['technique_pt'] as string} className={inputCls} placeholder="ex: Óleo sobre tela" />
          </Field>
          <div className="flex gap-4 items-end">
            <Field label="Ano de criação">
              <input name="year_created" type="number" defaultValue={d['year_created'] as number} className={inputCls} placeholder="ex: 1985" min="1000" max={new Date().getFullYear() + 1} />
            </Field>
            <div className="pb-2 flex items-center gap-2 shrink-0">
              <input type="checkbox" name="year_created_circa" id="year_circa" defaultChecked={d['year_created_circa'] as boolean} className={checkboxCls} />
              <label htmlFor="year_circa" className="font-body text-[12px] text-[--color-ink-subtle] whitespace-nowrap">Circa (c.)</label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Field label="Altura (cm)">
            <input name="height_cm" type="number" step="0.1" defaultValue={d['height_cm'] as number} className={inputCls} />
          </Field>
          <Field label="Largura (cm)">
            <input name="width_cm" type="number" step="0.1" defaultValue={d['width_cm'] as number} className={inputCls} />
          </Field>
          <Field label="Profundidade (cm)">
            <input name="depth_cm" type="number" step="0.1" defaultValue={d['depth_cm'] as number} className={inputCls} />
          </Field>
        </div>

        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="iphan_restricted" defaultChecked={d['iphan_restricted'] as boolean} className={checkboxCls} />
            <span className="font-body text-[12px] text-[--color-ink]">Restrição IPHAN</span>
          </label>
        </div>
      </section>

      {/* ─── Títulos adicionais ─── */}
      <section>
        <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-4 pb-2 border-b border-[--color-border]">
          Títulos em outros idiomas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Título (English)">
            <input name="title_en" defaultValue={d['title_en'] as string} className={inputCls} />
          </Field>
          <Field label="Titre (Français)">
            <input name="title_fr" defaultValue={d['title_fr'] as string} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* ─── Precificação ─── */}
      <section>
        <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-4 pb-2 border-b border-[--color-border]">
          Precificação e Visibilidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Preço (BRL)">
            <input name="price_brl" type="number" step="0.01" defaultValue={d['price_brl'] as number} className={inputCls} placeholder="ex: 15000.00" />
          </Field>
          <Field label="Preço (USD)">
            <input name="price_usd" type="number" step="0.01" defaultValue={d['price_usd'] as number} className={inputCls} placeholder="ex: 2800.00" />
          </Field>
          <Field label="Visibilidade do preço">
            <select name="price_visibility" defaultValue={d['price_visibility'] as string ?? 'on_request'} className={selectCls}>
              {PRICE_VIS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-4 max-w-[220px]">
          <Field label="Status da peça">
            <select name="status" defaultValue={d['status'] as string ?? 'rascunho'} className={selectCls}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* ─── Descrição e Proveniência ─── */}
      <section>
        <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-4 pb-2 border-b border-[--color-border]">
          Descrição e Proveniência
        </h2>
        <div className="space-y-4">
          <Field label="Descrição (Português)">
            <textarea name="description_pt" rows={4} defaultValue={d['description_pt'] as string} className={`${inputCls} resize-y`} />
          </Field>
          <Field label="Descrição (English)">
            <textarea name="description_en" rows={3} defaultValue={d['description_en'] as string} className={`${inputCls} resize-y`} />
          </Field>
          <Field label="Descrição (Français)">
            <textarea name="description_fr" rows={3} defaultValue={d['description_fr'] as string} className={`${inputCls} resize-y`} />
          </Field>
          <Field label="Proveniência (visível ao público)">
            <textarea name="provenance_pt" rows={4} defaultValue={d['provenance_pt'] as string} className={`${inputCls} resize-y`} placeholder="Histórico de propriedade, exposições, publicações..." />
          </Field>
          <Field label="Notas do curador (uso interno)">
            <textarea name="curator_notes_pt" rows={3} defaultValue={d['curator_notes_pt'] as string} className={`${inputCls} resize-y`} />
          </Field>
        </div>
      </section>

      {/* ─── Imagens (apenas em edição) ─── */}
      {pieceId && (
        <section>
          <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-4 pb-2 border-b border-[--color-border]">
            Imagens
          </h2>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
              {images.sort((a, b) => a.order - b.order).map((img) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-square relative overflow-hidden border border-[--color-border]">
                    <Image src={img.url} alt="" fill className="object-cover" sizes="120px" />
                    {img.is_primary && (
                      <div className="absolute inset-x-0 bottom-0 bg-[--color-accent]/90 text-[--color-paper] font-body text-[9px] uppercase tracking-[0.08em] text-center py-0.5">
                        Principal
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {!img.is_primary && (
                      <button type="button" onClick={() => setPrimaryImage(img.id, pieceId)} className="font-body text-[9px] uppercase text-white bg-[--color-accent]/80 px-2 py-1">
                        Principal
                      </button>
                    )}
                    <button type="button" onClick={() => deleteImage(img.id, pieceId)} className="font-body text-[9px] uppercase text-white bg-red-600/80 px-2 py-1">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImageUpload} className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className={['inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.1em] cursor-pointer border border-dashed border-[--color-border] hover:border-[--color-accent] px-6 py-4 transition-colors', uploadPending ? 'opacity-50 pointer-events-none' : ''].join(' ')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            {uploadPending ? 'Enviando...' : 'Adicionar imagem'}
          </label>
          <p className="font-body text-[10px] text-[--color-ink-subtle] mt-2">
            JPEG, PNG, WebP ou AVIF. Primeira imagem é definida como principal automaticamente.
          </p>
        </section>
      )}

      {/* ─── Submit ─── */}
      <div className="flex items-center gap-4 pt-4 border-t border-[--color-border]">
        <button type="submit" disabled={isPending} className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-8 py-3 transition-colors disabled:opacity-40">
          {isPending ? 'Salvando...' : pieceId ? 'Salvar alterações' : 'Criar peça'}
        </button>
        {!pieceId && (
          <p className="font-body text-[11px] text-[--color-ink-subtle]">
            Após criar, você poderá adicionar imagens.
          </p>
        )}
      </div>
    </form>
  )
}
