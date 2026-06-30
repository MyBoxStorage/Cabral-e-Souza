'use client'

import { Button } from '@cabral-souza/ui'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo, type LogoTone } from './Logo'
import { MobileMenu } from './MobileMenu'

const SCROLL_THRESHOLD = 80

/** Rotas com hero escuro no topo — header transparente com texto claro */
const DARK_HERO_ROUTES = ['/', '/sobre', '/vender-obra']

function normalizePath(pathname: string): string {
  const stripped = pathname.replace(/^\/(pt-BR|en-US|fr-FR)(?=\/|$)/, '')
  return stripped || '/'
}

function isNavActive(pathname: string, href: string): boolean {
  const current = normalizePath(pathname)
  if (href === '/') return current === '/'
  return current === href || current.startsWith(`${href}/`)
}

function resolveLogoTone(scrolled: boolean, pathname: string): LogoTone {
  if (scrolled) return 'on-dark'
  const current = normalizePath(pathname)
  return DARK_HERO_ROUTES.includes(current) ? 'on-dark' : 'on-cream'
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
      setScrolled(window.scrollY >= SCROLL_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logoTone = resolveLogoTone(scrolled, pathname)
  const onDarkHero = logoTone === 'on-dark'

  const navLinkClass = (active: boolean) =>
    [
      'font-body font-medium uppercase tracking-caps text-eyebrow',
      'transition-colors duration-slow ease-smooth',
      scrolled || onDarkHero
        ? active
          ? 'text-bronze-300'
          : 'text-cream-300/80 hover:text-bronze-300'
        : active
          ? 'text-bronze-500'
          : 'text-ink-800 hover:text-bronze-500',
    ].join(' ')

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-30',
        'transition-[background-color,box-shadow,border-color] duration-slow ease-smooth',
        scrolled
          ? 'bg-ink-900 shadow-lg border-b border-ink-700/50'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="container-default flex items-center justify-between h-16 lg:h-[72px]">
        <Logo tone={logoTone} />

        <nav aria-label="Menu principal" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isNavActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={navLinkClass(active)}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <Button asChild size="sm" variant="primary">
              <Link href="/contato">{t('contato')}</Link>
            </Button>
          </div>

          <MobileMenu links={navLinks} headerTone={scrolled || onDarkHero ? 'on-dark' : 'on-cream'} />
        </div>
      </div>
    </header>
  )
}
