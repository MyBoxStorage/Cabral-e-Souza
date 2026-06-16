'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Acervo',
    href: '/admin/pecas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <path d="M3 9l5-5M21 9l-5-5M3 15l5 5M21 15l-5 5"/>
      </svg>
    ),
  },
  {
    label: 'Artistas',
    href: '/admin/artistas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
      </svg>
    ),
  },
  {
    label: 'Leads',
    href: '/admin/leads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    label: 'Viewing Rooms',
    href: '/admin/viewing-rooms',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Boletim',
    href: '/admin/boletim',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
  },
  {
    label: 'CNART / COAF',
    href: '/admin/compliance',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
  },
]

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  // Determinar prefixo de locale se presente
  const localePrefix = pathname.match(/^\/(pt-BR|en-US|fr-FR)/)?.[1] ?? null
  const base = localePrefix ? `/${localePrefix}` : ''

  function isActive(href: string) {
    const full = base + href
    if (href === '/admin') return pathname === full || pathname === `${full}/`
    return pathname.startsWith(full)
  }

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-[--color-ink] border-r border-[rgba(250,250,247,0.08)] min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-[rgba(250,250,247,0.06)]">
        <p className="font-display text-[1rem] text-[--color-paper] tracking-[-0.01em]">
          Cabral &amp; Souza
        </p>
        <p className="font-body text-[9px] uppercase tracking-[0.18em] text-[--color-accent] mt-0.5">
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4" aria-label="Navegação administrativa">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={(base + item.href) as Parameters<typeof Link>[0]['href']}
            className={[
              'flex items-center gap-3 px-6 py-2.5 font-body text-[12px] transition-colors duration-150',
              isActive(item.href)
                ? 'text-[--color-accent] bg-[--color-accent]/8'
                : 'text-[rgba(250,250,247,0.45)] hover:text-[rgba(250,250,247,0.8)] hover:bg-[rgba(250,250,247,0.04)]',
            ].join(' ')}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="px-6 py-4 border-t border-[rgba(250,250,247,0.06)]">
        <p className="font-body text-[10px] text-[rgba(250,250,247,0.3)] truncate mb-3">
          {userEmail}
        </p>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="font-body text-[10px] uppercase tracking-[0.08em] text-[rgba(250,250,247,0.3)] hover:text-[rgba(250,250,247,0.6)] transition-colors"
          >
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
