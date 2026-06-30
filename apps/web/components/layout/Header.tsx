'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MobileMenu } from './MobileMenu'

function normalizePath(pathname: string): string {
  const stripped = pathname.replace(/^\/(pt-BR|en-US|fr-FR)(?=\/|$)/, '')
  return stripped || '/'
}

function isNavActive(pathname: string, href: string): boolean {
  const current = normalizePath(pathname)
  if (href === '/') return current === '/'
  return current === href || current.startsWith(`${href}/`)
}

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const navLinks: { href: `/${string}`; label: string }[] = [
    { href: '/acervo', label: t('acervo') },
    { href: '/artistas', label: t('artistas') },
    { href: '/boletim', label: t('boletim') },
    { href: '/sobre', label: t('sobre') },
    { href: '/vender-obra', label: t('vender') },
  ]

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-30 border-b transition-all duration-300',
        scrolled
          ? 'bg-[--color-paper]/98 backdrop-blur-md border-[--color-paper-deep] shadow-[0_1px_0_rgba(0,0,0,0.04)]'
          : 'bg-[--color-paper]/90 backdrop-blur-sm border-transparent',
      ].join(' ')}
    >
      <div className="container-default flex items-center justify-between h-16 md:h-[72px]">
        <Link
          href="/"
          aria-label="Cabral & Souza — página inicial"
          aria-current={isNavActive(pathname, '/') ? 'page' : undefined}
          className="flex flex-col leading-none group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent] rounded-sm"
        >
          <span
            className="font-display text-[1.0625rem] tracking-[-0.01em] text-[--color-ink] group-hover:text-[--color-accent] transition-colors duration-200"
            aria-hidden
          >
            Cabral &amp; Souza
          </span>
          <span className="font-body text-[9px] uppercase tracking-[0.18em] text-[--color-ink-subtle] mt-[2px]">
            Galeria de Arte
          </span>
        </Link>

        <nav aria-label="Menu principal" className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = isNavActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'font-body text-[13px] tracking-[0.04em] transition-colors duration-200 relative',
                  'after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:bg-[--color-accent] after:transition-transform after:duration-200 after:origin-left',
                  active
                    ? 'text-[--color-ink] after:scale-x-100'
                    : 'text-[--color-ink-muted] hover:text-[--color-ink] after:scale-x-0 hover:after:scale-x-100',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contato"
              className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-4 py-2 transition-colors duration-200"
            >
              {t('contato')}
            </Link>
          </div>

          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  )
}
