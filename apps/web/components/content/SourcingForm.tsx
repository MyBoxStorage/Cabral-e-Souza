'use client'

import { useState } from 'react'
import { Button } from '@cabral-souza/ui'
import { submitSourcingLead } from '../../app/actions/sourcing'

const CATEGORIES = [
  { value: 'pintura', label: 'Pintura' },
  { value: 'escultura', label: 'Escultura' },
  { value: 'desenho', label: 'Desenho' },
  { value: 'gravura', label: 'Gravura' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'objeto', label: 'Objeto' },
  { value: 'antiguidade', label: 'Antiguidade' },
] as const

const VALUE_RANGES = [
  { value: 'ate_20k', label: 'Até R$ 20 mil' },
  { value: '20_80k', label: 'R$ 20 mil – R$ 80 mil' },
  { value: '80_300k', label: 'R$ 80 mil – R$ 300 mil' },
  { value: '300k_mais', label: 'Acima de R$ 300 mil' },
  { value: 'nao_sei', label: 'Não sei avaliar' },
] as const

const MIN_PHOTOS = 3
const MAX_PHOTOS = 8

interface PhotoPreview {
  id: string
  url: string
  name: string
}

interface SourcingFormProps {
  id?: string
  showTitle?: boolean
}

export function SourcingForm({ id = 'sourcing-form', showTitle = true }: SourcingFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [previews, setPreviews] = useState<PhotoPreview[]>([])
  const [photoError, setPhotoError] = useState('')

  function revokePreviews(items: PhotoPreview[]) {
    items.forEach((p) => URL.revokeObjectURL(p.url))
  }

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    revokePreviews(previews)
    setPhotoError('')

    if (files.length === 0) {
      setPreviews([])
      return
    }

    if (files.length < MIN_PHOTOS) {
      setPhotoError(`Envie pelo menos ${MIN_PHOTOS} fotos.`)
      setPreviews([])
      e.target.value = ''
      return
    }

    if (files.length > MAX_PHOTOS) {
      setPhotoError(`Máximo de ${MAX_PHOTOS} fotos.`)
      setPreviews([])
      e.target.value = ''
      return
    }

    setPreviews(
      files.map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const fd = new FormData(form)
    const files = fd.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0)

    if (files.length < MIN_PHOTOS || files.length > MAX_PHOTOS) {
      setStatus('error')
      setPhotoError(`Selecione entre ${MIN_PHOTOS} e ${MAX_PHOTOS} fotos.`)
      setErrorMsg('Verifique as fotos antes de enviar.')
      return
    }

    const result = await submitSourcingLead(fd)
    if (result.ok) {
      setStatus('success')
      form.reset()
      revokePreviews(previews)
      setPreviews([])
    } else {
      setStatus('error')
      setErrorMsg(result.error)
    }
  }

  const inputClass =
    'w-full border-0 border-b border-cream-200 bg-transparent px-0 py-3 font-body text-body text-ink-800 placeholder:italic placeholder:text-ink-700/50 focus:outline-none focus:border-bronze-500 transition-colors duration-base'
  const labelClass =
    'block font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500 mb-2'

  if (status === 'success') {
    return (
      <div className="border border-bronze-500/30 bg-bronze-500/5 p-8 text-center">
        <p className="font-display text-title-xs text-ink-800 mb-3">Recebemos sua solicitação</p>
        <p className="font-body text-body text-ink-700 leading-relaxed">
          Retornaremos em até 5 dias úteis com uma análise preliminar. Nossa equipe entrará em contato pelo email ou
          telefone informado.
        </p>
      </div>
    )
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-5" encType="multipart/form-data">
      {showTitle && (
        <h2 className="font-display font-medium text-title-xs text-ink-800 mb-2">
          Solicitar avaliação preliminar
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${id}-seller_name`} className={labelClass}>
            Nome completo *
          </label>
          <input id={`${id}-seller_name`} name="seller_name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-seller_email`} className={labelClass}>
            E-mail *
          </label>
          <input id={`${id}-seller_email`} name="seller_email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-seller_phone`} className={labelClass}>
            Telefone / WhatsApp *
          </label>
          <input id={`${id}-seller_phone`} name="seller_phone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-seller_city`} className={labelClass}>
            Cidade *
          </label>
          <input id={`${id}-seller_city`} name="seller_city" required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${id}-technique_claimed`} className={labelClass}>
            Tipo de obra *
          </label>
          <select id={`${id}-technique_claimed`} name="technique_claimed" required className={inputClass}>
            <option value="">Selecione...</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-artist_claimed`} className={labelClass}>
            Artista (se souber)
          </label>
          <input
            id={`${id}-artist_claimed`}
            name="artist_claimed"
            placeholder="Ex: Alfredo Volpi"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-dimensions_claimed`} className={labelClass}>
          Dimensões aproximadas
        </label>
        <input
          id={`${id}-dimensions_claimed`}
          name="dimensions_claimed"
          placeholder="Ex: 80 × 60 cm"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${id}-acquisition_history`} className={labelClass}>
          Histórico de aquisição *
        </label>
        <textarea
          id={`${id}-acquisition_history`}
          name="acquisition_history"
          rows={4}
          required
          placeholder="Como a obra entrou na família? Há documentação, certificados ou laudos?"
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label htmlFor={`${id}-value_range`} className={labelClass}>
          Expectativa de valor *
        </label>
        <select id={`${id}-value_range`} name="value_range" required className={inputClass}>
          <option value="">Selecione uma faixa...</option>
          {VALUE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-photos`} className={labelClass}>
          Fotos da obra ({MIN_PHOTOS} a {MAX_PHOTOS} imagens) *
        </label>
        <input
          id={`${id}-photos`}
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          onChange={handlePhotosChange}
          className="w-full font-body text-body-sm text-ink-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-ink-800 file:text-cream-100 file:font-body file:text-eyebrow file:uppercase file:tracking-caps"
        />
        <p className="font-body text-caption text-ink-700 mt-2">
          Inclua foto geral, detalhes, assinatura e verso quando possível.
        </p>
        {photoError && (
          <p role="alert" className="mt-2 font-body text-body-sm text-red-600">
            {photoError}
          </p>
        )}
        {previews.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 list-none">
            {previews.map((preview) => (
              <li key={preview.id} className="relative aspect-square bg-cream-200 overflow-hidden border border-cream-200">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" name="consent_data" value="true" required className="mt-1 accent-bronze-500" />
        <span className="font-body text-body-sm text-ink-700 leading-relaxed">
          Autorizo o tratamento dos meus dados conforme a{' '}
          <a href="/privacidade" className="text-bronze-500 hover:underline">
            Política de Privacidade
          </a>{' '}
          (LGPD), exclusivamente para avaliação desta obra.
        </span>
      </label>

      {status === 'error' && (
        <p role="alert" className="font-body text-body-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? 'Enviando...' : 'Solicitar avaliação →'}
      </Button>

      <p className="font-body text-caption text-ink-700">
        Sua mensagem é confidencial e analisada por especialistas.
      </p>
    </form>
  )
}
