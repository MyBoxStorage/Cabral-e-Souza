'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { submitLead } from '../../app/actions/lead'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Mensagem obrigatória'),
  consent_marketing: z.boolean(),
})

type FormValues = z.infer<typeof schema>

const WHATSAPP_URL = 'https://wa.me/5521970027830'

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

  if (status === 'success') {
    return (
      <div className="border border-[--color-accent]/30 bg-[--color-accent]/5 p-6 text-center">
        <p className="font-display text-[1.25rem] font-light text-[--color-ink] mb-2">{t('success_title')}</p>
        <p className="font-body text-[13px] text-[--color-ink-muted]">{t('success_description')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="contact-name" className="block font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle] mb-2">
          {t('name')}
        </label>
        <input
          id="contact-name"
          {...register('name')}
          className="w-full border border-[--color-paper-deep] bg-[--color-paper] px-4 py-3 font-body text-[14px] text-[--color-ink] focus:outline-none focus:border-[--color-accent]"
        />
        {errors.name && <p className="mt-1 font-body text-[12px] text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="block font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle] mb-2">
          {t('email')}
        </label>
        <input
          id="contact-email"
          type="email"
          {...register('email')}
          className="w-full border border-[--color-paper-deep] bg-[--color-paper] px-4 py-3 font-body text-[14px] text-[--color-ink] focus:outline-none focus:border-[--color-accent]"
        />
        {errors.email && <p className="mt-1 font-body text-[12px] text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className="block font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle] mb-2">
          {t('phone')}
        </label>
        <input
          id="contact-phone"
          type="tel"
          {...register('phone')}
          className="w-full border border-[--color-paper-deep] bg-[--color-paper] px-4 py-3 font-body text-[14px] text-[--color-ink] focus:outline-none focus:border-[--color-accent]"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle] mb-2">
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register('message')}
          className="w-full border border-[--color-paper-deep] bg-[--color-paper] px-4 py-3 font-body text-[14px] text-[--color-ink] resize-y focus:outline-none focus:border-[--color-accent]"
        />
        {errors.message && <p className="mt-1 font-body text-[12px] text-red-600">{errors.message.message}</p>}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('consent_marketing')} className="mt-1" />
        <span className="font-body text-[12px] text-[--color-ink-subtle] leading-relaxed">{t('consent')}</span>
      </label>

      {status === 'error' && (
        <p className="font-body text-[12px] text-red-600">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] disabled:opacity-50 px-8 py-4 transition-colors duration-200"
      >
        {status === 'loading' ? t('submitting') : t('submit')}
      </button>

      <p className="font-body text-[12px] text-[--color-ink-subtle] text-center">
        Ou fale conosco pelo{' '}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[--color-accent] hover:underline">
          WhatsApp
        </a>
      </p>
    </form>
  )
}
