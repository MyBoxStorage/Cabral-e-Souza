'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const t = useTranslations('nav')

  const navLinks: { href: `/${string}`; label: string }[] = [
    { href: '/acervo', label: t('acervo') },
    { href: '/artistas', label: t('artistas') },
    { href: '/boletim', label: t('boletim') },
    { href: '/sobre', label: t('sobre') },
    { href: '/vender-obra', label: t('vender') },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 bg-[--color-paper]/95 backdrop-blur-sm border-b border-[--color-paper-deep]"
      style={{ transition: 'border-color 200ms ease' }}
    >
      <div className="container-default flex items-center justify-between h-16 md:h-[72px]">
        <Link
          href="/"
          aria-label="Cabral & Souza — página inicial"
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-[13px] tracking-[0.04em] text-[--color-ink-muted] hover:text-[--color-ink] transition-colors duration-200 relative after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:bg-[--color-accent] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            >
              {link.label}
            </Link>
          ))}
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
