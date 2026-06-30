'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { BUSINESS, whatsappUrl } from '@cabral-souza/shared'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { submitLead } from '../../app/actions/lead'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().optional(),
  consent_marketing: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface LeadFormProps {
  pieceId: string
  pieceTitle: string
  whatsappNumber?: string
}

export function LeadForm({ pieceId, pieceTitle, whatsappNumber = BUSINESS.phone.whatsappE164 }: LeadFormProps) {
  const t = useTranslations('lead_form')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { consent_marketing: false },
  })

  async function onSubmit(values: FormValues) {
    setStatus('loading')
    try {
      await submitLead({
        ...values,
        piece_id: pieceId,
        source: 'site_formulario',
      })
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-[--color-paper-deep] p-6 text-center">
        <p className="font-display text-[1.125rem] font-light text-[--color-ink] mb-2">
          {t('success_title')}
        </p>
        <p className="font-body text-[13px] text-[--color-ink-muted]">
          {t('success_description')}
        </p>
      </div>
    )
  }

  const wppMessage = `Olá! Tenho interesse na obra "${pieceTitle}". Podem me dar mais informações?`
  const wppHref =
    whatsappNumber === BUSINESS.phone.whatsappE164
      ? whatsappUrl(wppMessage)
      : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(wppMessage)}`

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="lead-name" className="block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
            {t('name')} <span aria-label="obrigatório">*</span>
          </label>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="w-full font-body text-[14px] text-[--color-ink] bg-transparent border border-[--color-paper-deep] focus:border-[--color-accent] px-4 py-3 outline-none transition-colors"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'lead-name-error' : undefined}
          />
          {errors.name && (
            <p id="lead-name-error" role="alert" className="font-body text-[11px] text-[--color-danger] mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-email" className="block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
            {t('email')} <span aria-label="obrigatório">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full font-body text-[14px] text-[--color-ink] bg-transparent border border-[--color-paper-deep] focus:border-[--color-accent] px-4 py-3 outline-none transition-colors"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'lead-email-error' : undefined}
          />
          {errors.email && (
            <p id="lead-email-error" role="alert" className="font-body text-[11px] text-[--color-danger] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-phone" className="block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
            {t('phone')}
          </label>
          <input
            id="lead-phone"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            className="w-full font-body text-[14px] text-[--color-ink] bg-transparent border border-[--color-paper-deep] focus:border-[--color-accent] px-4 py-3 outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="lead-message" className="block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-2">
            {t('message')}
          </label>
          <textarea
            id="lead-message"
            rows={3}
            {...register('message')}
            className="w-full font-body text-[14px] text-[--color-ink] bg-transparent border border-[--color-paper-deep] focus:border-[--color-accent] px-4 py-3 outline-none transition-colors resize-none"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('consent_marketing')}
            className="mt-1 w-4 h-4 accent-[--color-accent] flex-shrink-0"
          />
          <span className="font-body text-[11px] text-[--color-ink-subtle] leading-relaxed">
            {t('consent')}
          </span>
        </label>

        {status === 'error' && (
          <p role="alert" className="font-body text-[12px] text-[--color-danger]">
            {t('error')}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] py-4 transition-colors duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
        >
          {status === 'loading' ? t('sending') : t('submit')}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[--color-paper-deep]" />
        <span className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle]">ou</span>
        <div className="flex-1 h-px bg-[--color-paper-deep]" />
      </div>

      {/* WhatsApp */}
      <a
        href={wppHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-paper-deep] hover:border-[--color-accent] hover:text-[--color-accent] py-4 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {t('whatsapp')}
      </a>
    </div>
  )
}
