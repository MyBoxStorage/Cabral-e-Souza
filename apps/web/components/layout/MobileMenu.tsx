'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { whatsappUrl } from '@cabral-souza/shared'

interface NavLink {
  href: `/${string}`
  label: string
}

interface MobileMenuProps {
  links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

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
    return () => { document.body.style.overflow = '' }
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
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent] rounded-sm"
      >
        <span
          className={[
            'block w-6 h-px bg-[--color-ink] transition-all duration-300 origin-center',
            open ? 'translate-y-[6px] rotate-45' : '',
          ].join(' ')}
        />
        <span
          className={[
            'block w-6 h-px bg-[--color-ink] transition-all duration-300',
            open ? 'opacity-0' : '',
          ].join(' ')}
        />
        <span
          className={[
            'block w-6 h-px bg-[--color-ink] transition-all duration-300 origin-center',
            open ? '-translate-y-[6px] -rotate-45' : '',
          ].join(' ')}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-[--color-ink]/40 z-40 md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('open_menu')}
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={[
          'fixed top-0 right-0 h-full w-[280px] bg-[--color-paper] z-50 md:hidden',
          'flex flex-col pt-20 pb-12 px-8 gap-2',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full pointer-events-none',
          'shadow-[-8px_0_40px_rgba(0,0,0,0.08)]',
        ].join(' ')}
      >
        <button
          aria-label={t('close_menu')}
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-[--color-ink-subtle] hover:text-[--color-ink] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent] rounded-sm transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <nav aria-label="Menu principal mobile">
          <ul className="flex flex-col gap-1 list-none">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block font-display text-[1.375rem] font-light tracking-[-0.01em] text-[--color-ink] py-3 border-b border-[--color-paper-deep] hover:text-[--color-accent] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.1em] text-[--color-accent] hover:text-[--color-accent-deep] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
