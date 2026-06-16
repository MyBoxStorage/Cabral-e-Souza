'use client'

import { useState, useTransition } from 'react'
import { upsertBoletimPost } from '../../app/actions/boletim'

interface BoletimFormProps {
  postId?: string
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

export function BoletimForm({ postId, initialData = {} }: BoletimFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const d = initialData

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await upsertBoletimPost(postId ?? null, fd)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[780px]">
      {error && (
        <div className="border border-red-200 bg-red-50 p-4">
          <p className="font-body text-[12px] text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Título (Português)" required>
          <input name="title_pt" required defaultValue={d['title_pt'] as string} className={inputCls} />
        </Field>
        <Field label="Slug" required>
          <input name="slug" required defaultValue={d['slug'] as string} pattern="[a-z0-9-]+" className={inputCls} placeholder="titulo-da-publicacao" />
        </Field>
        <Field label="Categoria" required>
          <select name="category" defaultValue={d['category'] as string ?? 'editorial'} className={inputCls}>
            <option value="editorial">Editorial</option>
            <option value="analise_leilao">Análise de Leilão</option>
            <option value="verbete_artista">Verbete de Artista</option>
            <option value="mercado">Mercado</option>
            <option value="noticia">Notícia</option>
          </select>
        </Field>
        <Field label="Resumo (excerpt)">
          <textarea name="excerpt_pt" rows={2} defaultValue={d['excerpt_pt'] as string} className={`${inputCls} resize-y`} />
        </Field>
      </div>

      <div className="mt-2">
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

      <Field label="Conteúdo (Markdown)" required>
        <textarea
          name="content_pt"
          required
          rows={16}
          defaultValue={d['content_pt'] as string}
          className={`${inputCls} resize-y font-mono text-[12px] leading-relaxed`}
          placeholder="# Título da publicação&#10;&#10;Texto do boletim..."
        />
        <p className="font-body text-[10px] text-[--color-ink-subtle] mt-1">
          Suporte a Markdown completo: # H1, ## H2, **negrito**, *itálico*, [link](url), ![imagem](url)
        </p>
      </Field>

      <Field label="URL de imagem de capa">
        <input name="hero_image_url" type="url" defaultValue={d['hero_image_url'] as string} className={inputCls} placeholder="https://..." />
      </Field>

      <div className="flex items-center gap-4 pt-4 border-t border-[--color-border]">
        <button
          type="submit"
          disabled={isPending}
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-8 py-3 transition-colors disabled:opacity-40"
        >
          {isPending ? 'Salvando...' : postId ? 'Salvar alterações' : 'Criar publicação'}

        </button>
      </div>
    </form>
  )
}
