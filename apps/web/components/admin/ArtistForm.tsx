'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { upsertArtist, uploadArtistPhoto } from '../../app/actions/artist'

interface ArtistFormProps {
  artistId?: string
  initialData?: Record<string, unknown>
}

const inputCls = 'w-full border border-[--color-border] bg-white focus:border-[--color-accent] font-body text-[13px] text-[--color-ink] px-3 py-2 outline-none transition-colors'

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

export function ArtistForm({ artistId, initialData = {} }: ArtistFormProps) {
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
        await upsertArtist(artistId ?? null, fd)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !artistId) return

    setUploadPending(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      await uploadArtistPhoto(artistId, fd)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploadPending(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-[700px]">
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
          <Field label="Nome" required>
            <input name="name" required defaultValue={d['name'] as string} className={inputCls} />
          </Field>
          <Field label="Slug" required>
            <input name="slug" required defaultValue={d['slug'] as string} pattern="[a-z0-9-]+" className={inputCls} placeholder="nome-do-artista" />
          </Field>
          <Field label="Nacionalidade">
            <input name="nationality" defaultValue={d['nationality'] as string} className={inputCls} placeholder="ex: Brasileira" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ano de nascimento">
              <input name="birth_year" type="number" defaultValue={d['birth_year'] as number} className={inputCls} placeholder="ex: 1952" />
            </Field>
            <Field label="Ano de falecimento">
              <input name="death_year" type="number" defaultValue={d['death_year'] as number} className={inputCls} placeholder="se aplicável" />
            </Field>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={d['is_published'] as boolean}
              className="w-4 h-4 border border-[--color-border] accent-[--color-accent]"
            />
            <span className="font-body text-[12px] text-[--color-ink]">Publicar no site</span>
          </label>
        </div>
      </section>

      {/* ─── Foto (apenas em edição) ─── */}
      {artistId && (
        <section>
          <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-4 pb-2 border-b border-[--color-border]">
            Foto
          </h2>
          <div className="flex items-start gap-6">
            {!!d['hero_image_url'] && (
              <div className="w-24 h-24 relative overflow-hidden border border-[--color-border] shrink-0">
                <Image
                  src={d['hero_image_url'] as string}
                  alt={d['name'] as string}
                  fill
                  className="object-cover grayscale"
                  sizes="96px"
                />
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className={[
                  'inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.1em] cursor-pointer',
                  'border border-dashed border-[--color-border] hover:border-[--color-accent] px-5 py-3 transition-colors',
                  uploadPending ? 'opacity-50 pointer-events-none' : '',
                ].join(' ')}
              >
                {uploadPending ? 'Enviando...' : d['hero_image_url'] ? 'Trocar foto' : 'Adicionar foto'}
              </label>
              <p className="font-body text-[10px] text-[--color-ink-subtle] mt-2">
                JPEG, PNG ou WebP. Proporção quadrada recomendada.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── Verbetes (Markdown) ─── */}
      <section>
        <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-1 pb-2 border-b border-[--color-border]">
          Verbetes biográficos
        </h2>
        <p className="font-body text-[11px] text-[--color-ink-subtle] mb-4">
          Suporte a Markdown: **negrito**, *itálico*, # títulos, [link](url).
        </p>
        <div className="space-y-4">
          <Field label="Português">
            <textarea
              name="bio_pt"
              rows={8}
              defaultValue={d['bio_pt'] as string}
              className={`${inputCls} resize-y font-mono text-[12px]`}
              placeholder="Nasceu em... Estudou... Sua obra é marcada por..."
            />
          </Field>
          <Field label="English">
            <textarea
              name="bio_en"
              rows={6}
              defaultValue={d['bio_en'] as string}
              className={`${inputCls} resize-y font-mono text-[12px]`}
            />
          </Field>
          <Field label="Français">
            <textarea
              name="bio_fr"
              rows={6}
              defaultValue={d['bio_fr'] as string}
              className={`${inputCls} resize-y font-mono text-[12px]`}
            />
          </Field>
        </div>
      </section>

      {/* ─── Submit ─── */}
      <div className="flex items-center gap-4 pt-4 border-t border-[--color-border]">
        <button
          type="submit"
          disabled={isPending}
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-8 py-3 transition-colors disabled:opacity-40"
        >
          {isPending ? 'Salvando...' : artistId ? 'Salvar alterações' : 'Criar artista'}
        </button>
      </div>
    </form>
  )
}
