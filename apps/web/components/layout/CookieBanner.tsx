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
        'fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-6 md:right-auto md:max-w-[420px]',
        'transition-[opacity,transform] duration-[280ms] ease-out motion-reduce:transition-none',
        dismissing ? 'opacity-0 translate-y-2 motion-reduce:translate-y-0' : 'opacity-100 translate-y-0',
      ].join(' ')}
    >
      <div className="bg-[--color-ink] text-[--color-paper] p-6 md:rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
        <p className="font-display text-[1rem] tracking-[-0.01em] mb-2">{t('title')}</p>
        <p className="font-body text-[12px] leading-[1.7] text-[rgba(250,250,247,0.6)] mb-5">
          {t('description')}{' '}
          <Link
            href="/privacidade"
            className="text-[--color-accent] hover:underline underline-offset-2 transition-colors"
          >
            {t('privacy_link')}
          </Link>
          .
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <label className="flex items-start gap-3 cursor-not-allowed">
            <div className="mt-[2px] w-4 h-4 rounded-[2px] bg-[--color-accent] flex items-center justify-center flex-shrink-0">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-body text-[12px] font-medium text-[--color-paper]">{t('essential_label')}</p>
              <p className="font-body text-[11px] text-[rgba(250,250,247,0.45)] mt-0.5">{t('essential_description')}</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-[2px] flex-shrink-0">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="sr-only peer"
                aria-label={t('analytics_label')}
              />
              <div className="w-4 h-4 rounded-[2px] border border-[rgba(250,250,247,0.25)] peer-checked:bg-[--color-accent] peer-checked:border-[--color-accent] peer-focus-visible:ring-1 peer-focus-visible:ring-[--color-accent] transition-colors flex items-center justify-center">
                {analytics && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <div>
              <p className="font-body text-[12px] font-medium text-[--color-paper] group-hover:text-[--color-accent] transition-colors">{t('analytics_label')}</p>
              <p className="font-body text-[11px] text-[rgba(250,250,247,0.45)] mt-0.5">{t('analytics_description')}</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-[2px] flex-shrink-0">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="sr-only peer"
                aria-label={t('marketing_label')}
              />
              <div className="w-4 h-4 rounded-[2px] border border-[rgba(250,250,247,0.25)] peer-checked:bg-[--color-accent] peer-checked:border-[--color-accent] peer-focus-visible:ring-1 peer-focus-visible:ring-[--color-accent] transition-colors flex items-center justify-center">
                {marketing && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <div>
              <p className="font-body text-[12px] font-medium text-[--color-paper] group-hover:text-[--color-accent] transition-colors">{t('marketing_label')}</p>
              <p className="font-body text-[11px] text-[rgba(250,250,247,0.45)] mt-0.5">{t('marketing_description')}</p>
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={acceptAll}
            className="w-full font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] bg-[--color-accent] hover:bg-[--color-accent-deep] py-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-1 focus-visible:ring-offset-[--color-ink]"
          >
            {t('accept_all')}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={acceptSelected}
              className="flex-1 font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] border border-[rgba(250,250,247,0.2)] hover:border-[--color-accent] hover:text-[--color-accent] py-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
            >
              {t('accept_selected')}
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="flex-1 font-body text-[11px] uppercase tracking-[0.1em] text-[rgba(250,250,247,0.6)] hover:text-[rgba(250,250,247,0.85)] py-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
            >
              {t('reject_all')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
