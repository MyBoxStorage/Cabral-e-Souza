'use client'

import { Button } from '@cabral-souza/ui'
import { BUSINESS, whatsappUrl } from '@cabral-souza/shared'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { LogoTone } from './Logo'

interface NavLink {
  href: `/${string}`
  label: string
}

interface MobileMenuProps {
  links: NavLink[]
  headerTone?: LogoTone
}

export function MobileMenu({ links, headerTone = 'on-cream' }: MobileMenuProps) {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const hamburgerColor = headerTone === 'on-dark' ? 'bg-bronze-300' : 'bg-bronze-500'

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const menu = menuRef.current
    if (!open || !menu) return

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        aria-label={open ? t('close_menu') : t('open_menu')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300 rounded-sm"
      >
        <span
          className={[
            'block w-6 h-px transition-all duration-slow origin-center',
            hamburgerColor,
            open ? 'translate-y-[6px] rotate-45' : '',
          ].join(' ')}
        />
        <span
          className={[
            'block w-6 h-px transition-all duration-slow',
            hamburgerColor,
            open ? 'opacity-0' : '',
          ].join(' ')}
        />
        <span
          className={[
            'block w-6 h-px transition-all duration-slow origin-center',
            hamburgerColor,
            open ? '-translate-y-[6px] -rotate-45' : '',
          ].join(' ')}
        />
      </button>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('open_menu')}
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={[
          'fixed inset-0 z-50 lg:hidden flex flex-col',
          'bg-ink-900 transition-opacity duration-slow',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-ink-700/60">
          <span className="font-display text-cream-300 text-body-lg">Menu</span>
          <button
            aria-label={t('close_menu')}
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-cream-300/60 hover:text-cream-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300 rounded-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Menu principal mobile" className="flex-1 px-6 py-8 overflow-y-auto">
          <ul className="flex flex-col list-none">
            {links.map((link, index) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={[
                    'block font-display font-medium text-title-sm text-cream-300 py-5',
                    'hover:text-bronze-300 transition-colors duration-base',
                    index < links.length - 1 ? 'border-b border-bronze-500/25' : '',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-6 pb-10 pt-6 border-t border-ink-700/60 flex flex-col gap-6">
          <Button asChild variant="primary" size="md" className="w-full justify-center">
            <Link href="/contato" onClick={() => setOpen(false)}>
              {t('contato')}
            </Link>
          </Button>

          <p className="font-body text-caption text-cream-300/50 leading-relaxed">
            {BUSINESS.address.street}
            <br />
            {BUSINESS.address.neighborhood} — {BUSINESS.address.city}, {BUSINESS.address.state}
          </p>

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="font-body text-caption uppercase tracking-caps text-bronze-300 hover:text-bronze-500 transition-colors w-fit"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
