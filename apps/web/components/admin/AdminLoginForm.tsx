'use client'

import { useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { adminLogin } from '../../app/actions/admin-auth'

export function AdminLoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? ''
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    startTransition(async () => {
      await adminLogin(fd)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

      <div>
        <label
          htmlFor="admin-email"
          className="block font-body text-[11px] uppercase tracking-[0.1em] text-[rgba(250,250,247,0.4)] mb-3"
        >
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          placeholder="seu@email.com.br"
          autoComplete="email"
          autoFocus
          required
          disabled={isPending}
          className="w-full bg-transparent border border-[rgba(250,250,247,0.12)] focus:border-[--color-accent] text-[--color-paper] font-body text-[14px] px-4 py-3.5 outline-none transition-colors placeholder:text-[rgba(250,250,247,0.2)] disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="block font-body text-[11px] uppercase tracking-[0.1em] text-[rgba(250,250,247,0.4)] mb-3"
        >
          Senha
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          autoComplete="current-password"
          required
          minLength={12}
          disabled={isPending}
          className="w-full bg-transparent border border-[rgba(250,250,247,0.12)] focus:border-[--color-accent] text-[--color-paper] font-body text-[14px] px-4 py-3.5 outline-none transition-colors placeholder:text-[rgba(250,250,247,0.2)] disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] bg-[--color-accent] hover:bg-[--color-accent-deep] py-4 transition-colors duration-200 disabled:opacity-40 mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent] focus-visible:ring-offset-1 focus-visible:ring-offset-[--color-ink]"
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="font-body text-[11px] text-[rgba(250,250,247,0.3)] text-center leading-relaxed mt-2">
        Acesso restrito. Apenas emails autorizados pelos sócios podem fazer login.
      </p>
    </form>
  )
}
