'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[ErrorPage]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="label-caps mb-6 text-[--color-danger]">Erro</p>
      <h1 className="font-display text-[2.5rem] md:text-[3rem] font-light tracking-[-0.02em] text-[--color-ink] mb-4">
        Algo não saiu como esperado
      </h1>
      <p className="font-body text-[15px] leading-[1.8] text-[--color-ink-muted] max-w-[44ch] mb-10">
        Encontramos uma dificuldade técnica ao carregar esta página. Tente novamente ou entre em contato com a galeria.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-8 py-4 transition-colors duration-200"
        >
          Tentar novamente
        </button>
        <Link
          href="/contato"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] border-b border-[--color-accent] pb-[2px] hover:text-[--color-ink] hover:border-[--color-ink] transition-colors"
        >
          Falar com a galeria
        </Link>
      </div>
    </div>
  )
}
