'use client'

import { Button } from '@cabral-souza/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { whatsappUrl } from '@cabral-souza/shared'
import { submitLead } from '../../app/actions/lead'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Mensagem obrigatória'),
  consent_marketing: z.boolean(),
})

type FormValues = z.infer<typeof schema>

function fieldErrorId(field: keyof FormValues) {
  return `contact-${field}-error`
}

export function ContactForm() {
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
      await submitLead({ ...values, source: 'site_formulario' })
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border-0 border-b border-cream-200 bg-transparent px-0 py-3 font-body text-body text-ink-800 placeholder:italic placeholder:text-ink-700/50 focus:outline-none focus:border-bronze-500 transition-colors duration-base'
  const labelClass =
    'block font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500 mb-2'

  if (status === 'success') {
    return (
      <div className="border border-bronze-500/30 bg-bronze-500/5 p-6 text-center">
        <p className="font-display text-title-xs text-ink-800 mb-2">{t('success_title')}</p>
        <p className="font-body text-body-sm text-ink-700">{t('success_description')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-medium text-title-xs text-ink-800">Envie uma mensagem</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            {t('name')}
          </label>
          <input
            id="contact-name"
            {...register('name')}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? fieldErrorId('name') : undefined}
            className={inputClass}
          />
          {errors.name && (
            <p id={fieldErrorId('name')} role="alert" className="mt-1 font-body text-body-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t('email')}
          </label>
          <input
            id="contact-email"
            type="email"
            {...register('email')}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? fieldErrorId('email') : undefined}
            className={inputClass}
          />
          {errors.email && (
            <p id={fieldErrorId('email')} role="alert" className="mt-1 font-body text-body-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {t('phone')}
          </label>
          <input id="contact-phone" type="tel" {...register('phone')} className={inputClass} />
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            {t('message')}
          </label>
          <textarea
            id="contact-message"
            rows={5}
            {...register('message')}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? fieldErrorId('message') : undefined}
            className={`${inputClass} resize-y`}
          />
          {errors.message && (
            <p id={fieldErrorId('message')} role="alert" className="mt-1 font-body text-body-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('consent_marketing')} className="mt-1 accent-bronze-500" />
          <span className="font-body text-body-sm text-ink-700 leading-relaxed">{t('consent')}</span>
        </label>

        {status === 'error' && (
          <p role="alert" className="font-body text-body-sm text-red-600">
            {t('error')}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? t('sending') : t('submit')}
        </Button>
      </form>

      <div className="flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-bronze-500/30" />
        <span className="font-body text-eyebrow uppercase tracking-caps text-bronze-500">ou</span>
        <span className="h-px flex-1 bg-bronze-500/30" />
      </div>

      <Button asChild variant="secondary" size="lg" className="w-full">
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          Falar via WhatsApp
        </a>
      </Button>
    </div>
  )
}
