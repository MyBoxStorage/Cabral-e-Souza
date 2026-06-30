'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRef, useState } from 'react'
import {
  CONSENT_COOKIE_NAME,
  consentCookieAttributes,
  serializeConsentCookie,
  type ConsentState,
} from '../../lib/cookie-consent'

const STORAGE_KEY = 'cs_cookie_consent'
const DISMISS_MS = 280

function persistConsent(state: ConsentState) {
  const serialized = serializeConsentCookie(state)
  document.cookie = `${CONSENT_COOKIE_NAME}=${serialized};${consentCookieAttributes()}`
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage indisponível */
  }
  window.dispatchEvent(new CustomEvent('cs:consent', { detail: state }))
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      htmlFor={id}
      className={[
        'flex items-start gap-3',
        disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer group',
      ].join(' ')}
    >
      <div className="relative mt-0.5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          className="peer sr-only"
        />
        <div
          className={[
            'flex h-4 w-4 items-center justify-center rounded-sm border transition-colors duration-base',
            'border-cream-300/30 peer-checked:border-bronze-500 peer-checked:bg-bronze-500',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-bronze-300 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-900',
            disabled ? 'bg-bronze-500 border-bronze-500' : '',
          ].join(' ')}
          aria-hidden
        >
          {(checked || disabled) && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cream-100"
              />
            </svg>
          )}
        </div>
      </div>
      <div>
        <p className="font-body text-body-sm font-medium text-cream-100 group-hover:text-bronze-300 transition-colors">
          {label}
        </p>
        <p className="mt-0.5 font-body text-caption text-cream-300/60 leading-relaxed">{description}</p>
      </div>
    </label>
  )
}

export function CookieBanner() {
  const t = useTranslations('cookie')
  const bannerRef = useRef<HTMLDivElement>(null)
  const [dismissing, setDismissing] = useState(false)
  const [mounted, setMounted] = useState(true)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  function dismiss(state: ConsentState) {
    persistConsent(state)
    setDismissing(true)
    window.setTimeout(() => setMounted(false), DISMISS_MS)
  }

  function acceptAll() {
    dismiss({ analytics: true, marketing: true, decided: true })
  }

  function acceptSelected() {
    dismiss({ analytics, marketing, decided: true })
  }

  function rejectAll() {
    dismiss({ analytics: false, marketing: false, decided: true })
  }

  if (!mounted) return null

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="false"
      aria-label="Consentimento de cookies"
      className={[
        'fixed bottom-0 left-0 right-0 z-50',
        'border-t border-bronze-500/20 bg-ink-900 shadow-[0_-8px_32px_rgba(26,22,18,0.35)]',
        'transition-[opacity,transform] duration-[280ms] ease-out motion-reduce:transition-none',
        dismissing ? 'opacity-0 translate-y-2 motion-reduce:translate-y-0' : 'opacity-100 translate-y-0',
      ].join(' ')}
    >
      <div className="container-default max-w-[1200px] py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
          <div>
            <p className="font-display text-title-xs text-cream-100 mb-2">{t('title')}</p>
            <p className="font-body text-body-sm text-cream-300/75 leading-relaxed mb-5 max-w-2xl">
              {t('description')}{' '}
              <Link href="/privacidade" className="text-bronze-300 hover:text-bronze-500 underline underline-offset-2">
                {t('privacy_link')}
              </Link>
              .
            </p>

            <div className="flex flex-col gap-3 max-w-xl">
              <ToggleRow
                id="cookie-essential"
                label={t('essential_label')}
                description={t('essential_description')}
                checked
                disabled
              />
              <ToggleRow
                id="cookie-analytics"
                label={t('analytics_label')}
                description={t('analytics_description')}
                checked={analytics}
                onChange={setAnalytics}
              />
              <ToggleRow
                id="cookie-marketing"
                label={t('marketing_label')}
                description={t('marketing_description')}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:min-w-[220px]">
            <button
              type="button"
              onClick={acceptAll}
              className="font-body text-eyebrow font-medium uppercase tracking-caps bg-bronze-500 text-cream-100 hover:bg-bronze-700 px-5 py-3 rounded-md transition-colors duration-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
            >
              {t('accept_all')}
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="font-body text-eyebrow font-medium uppercase tracking-caps border border-cream-300/50 text-cream-300 hover:border-cream-300 hover:bg-cream-100/5 px-5 py-3 rounded-md transition-colors duration-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
            >
              {t('reject_all')}
            </button>
            <button
              type="button"
              onClick={acceptSelected}
              className="font-body text-eyebrow font-medium uppercase tracking-caps border border-bronze-500 text-bronze-300 hover:bg-bronze-500 hover:text-cream-100 px-5 py-3 rounded-md transition-colors duration-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
            >
              {t('accept_selected')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
