'use client'

import { useState } from 'react'
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

export function SourcingForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const fd = new FormData(form)

    const result = await submitSourcingLead(fd)
    if (result.ok) {
      setStatus('success')
      form.reset()
    } else {
      setStatus('error')
      setErrorMsg(result.error)
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-[--color-accent]/30 bg-[--color-accent]/5 p-8 text-center">
        <p className="font-display text-[1.5rem] font-light text-[--color-ink] mb-3">
          Recebemos sua solicitação
        </p>
        <p className="font-body text-[14px] leading-[1.7] text-[--color-ink-muted]">
          Retornaremos em até 5 dias úteis com uma análise preliminar. Nossa equipe entrará em contato pelo email ou
          telefone informado.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full border border-[--color-paper-deep] bg-[--color-paper] px-4 py-3 font-body text-[14px] text-[--color-ink] focus:outline-none focus:border-[--color-accent]'
  const labelClass =
    'block font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle] mb-2'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" encType="multipart/form-data">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="seller_name" className={labelClass}>Nome completo *</label>
          <input id="seller_name" name="seller_name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="seller_email" className={labelClass}>Email *</label>
          <input id="seller_email" name="seller_email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="seller_phone" className={labelClass}>Telefone / WhatsApp *</label>
          <input id="seller_phone" name="seller_phone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="seller_city" className={labelClass}>Cidade *</label>
          <input id="seller_city" name="seller_city" required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="technique_claimed" className={labelClass}>Tipo de obra *</label>
          <select id="technique_claimed" name="technique_claimed" required className={inputClass}>
            <option value="">Selecione...</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="artist_claimed" className={labelClass}>Artista (se souber)</label>
          <input id="artist_claimed" name="artist_claimed" placeholder="Ex: Alfredo Volpi" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="dimensions_claimed" className={labelClass}>Dimensões aproximadas</label>
        <input id="dimensions_claimed" name="dimensions_claimed" placeholder="Ex: 80 × 60 cm" className={inputClass} />
      </div>

      <div>
        <label htmlFor="acquisition_history" className={labelClass}>Histórico de aquisição *</label>
        <textarea
          id="acquisition_history"
          name="acquisition_history"
          rows={4}
          required
          placeholder="Como a obra entrou na família? Há documentação, certificados ou laudos?"
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="value_range" className={labelClass}>Expectativa de valor *</label>
        <select id="value_range" name="value_range" required className={inputClass}>
          <option value="">Selecione uma faixa...</option>
          {VALUE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="photos" className={labelClass}>Fotos da obra (3 a 8 imagens)</label>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="w-full font-body text-[13px] text-[--color-ink-muted] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[--color-ink] file:text-[--color-paper] file:font-body file:text-[11px] file:uppercase file:tracking-wider"
        />
        <p className="font-body text-[11px] text-[--color-ink-subtle] mt-2">
          Inclua foto geral, detalhes, assinatura e verso quando possível.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" name="consent_data" value="true" required className="mt-1" />
        <span className="font-body text-[12px] text-[--color-ink-subtle] leading-relaxed">
          Autorizo o tratamento dos meus dados conforme a{' '}
          <a href="/privacidade" className="text-[--color-accent] hover:underline">Política de Privacidade</a>{' '}
          (LGPD), exclusivamente para avaliação desta obra.
        </span>
      </label>

      {status === 'error' && (
        <p className="font-body text-[13px] text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] disabled:opacity-50 px-8 py-4 transition-colors duration-200"
      >
        {status === 'loading' ? 'Enviando...' : 'Solicitar avaliação preliminar'}
      </button>
    </form>
  )
}
