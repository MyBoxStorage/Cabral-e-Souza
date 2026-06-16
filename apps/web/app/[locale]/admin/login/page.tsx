'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Ler searchParams de forma síncrona via React.use() não é possível em Client Components,
  // então usamos window.location para ler os parâmetros no cliente
  const urlParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()

  const isUnauthorized = urlParams.get('error') === 'unauthorized'
  const redirectParam = urlParams.get('redirect') ?? ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    const supabase = createBrowserClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!
    )

    const redirectTo = `${window.location.origin}/admin/auth/callback${
      redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''
    }`

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="min-h-screen bg-[--color-ink] flex items-center justify-center p-6">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-12">
          <p className="font-display text-[1.375rem] text-[--color-paper] tracking-[-0.01em]">
            Cabral &amp; Souza
          </p>
          <p className="font-body text-[10px] uppercase tracking-[0.18em] text-[--color-accent] mt-1">
            Área administrativa
          </p>
        </div>

        {isUnauthorized && (
          <div className="border border-[--color-danger]/30 bg-[--color-danger]/10 p-4 mb-6 text-center">
            <p className="font-body text-[12px] text-[rgba(250,250,247,0.7)]">
              Email não autorizado. Acesso restrito a administradores.
            </p>
          </div>
        )}

        {status === 'sent' ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[--color-accent]/20 flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[--color-accent]" aria-hidden>
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <p className="font-display text-[1.125rem] font-light text-[--color-paper] mb-3">
              Link enviado
            </p>
            <p className="font-body text-[13px] text-[rgba(250,250,247,0.55)] leading-relaxed">
              Verifique sua caixa de entrada em{' '}
              <span className="text-[--color-accent]">{email}</span>.
              O link expira em 1 hora.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 font-body text-[11px] uppercase tracking-[0.1em] text-[rgba(250,250,247,0.4)] hover:text-[rgba(250,250,247,0.7)] transition-colors"
            >
              Usar outro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-body text-[11px] uppercase tracking-[0.1em] text-[rgba(250,250,247,0.4)] mb-3"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                autoComplete="email"
                autoFocus
                required
                className="w-full bg-transparent border border-[rgba(250,250,247,0.12)] focus:border-[--color-accent] text-[--color-paper] font-body text-[14px] px-4 py-3.5 outline-none transition-colors placeholder:text-[rgba(250,250,247,0.2)]"
                aria-describedby={status === 'error' ? 'login-error' : undefined}
              />
            </div>

            {status === 'error' && (
              <p id="login-error" role="alert" className="font-body text-[12px] text-[--color-danger]">
                {errorMsg || 'Erro ao enviar link. Tente novamente.'}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              className="w-full font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] bg-[--color-accent] hover:bg-[--color-accent-deep] py-4 transition-colors duration-200 disabled:opacity-40 mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent] focus-visible:ring-offset-1 focus-visible:ring-offset-[--color-ink]"
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar link de acesso'}
            </button>

            <p className="font-body text-[11px] text-[rgba(250,250,247,0.3)] text-center leading-relaxed mt-2">
              Acesso restrito. Apenas emails autorizados pelos sócios podem fazer login.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
