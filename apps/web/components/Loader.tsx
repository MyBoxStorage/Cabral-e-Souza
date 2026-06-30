'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'loader-shown'
const TOTAL_MS = 2400
const REDUCED_MS = 400

function BandeirinhasPlaceholder() {
  const stripes = ['#c4a878', '#9a6f3f', '#6f4f2c', '#c4a878', '#9a6f3f', '#ede5d4', '#9a6f3f']

  return (
    <div
      className="relative w-[min(72vw,280px)] aspect-[4/5] overflow-hidden rounded-sm"
      aria-hidden
    >
      <div className="absolute inset-0 flex">
        {stripes.map((color, i) => (
          <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  )
}

export function Loader() {
  const [phase, setPhase] = useState<'hidden' | 'active' | 'exit'>('hidden')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(reduced)
    setPhase('active')

    const duration = reduced ? REDUCED_MS : TOTAL_MS
    const fadeOutMs = reduced ? 200 : 400

    const exitTimer = window.setTimeout(() => {
      setPhase('exit')
    }, duration - fadeOutMs)

    const hideTimer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setPhase('hidden')
    }, duration)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  if (phase === 'hidden') return null

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] flex items-center justify-center bg-ink-900 loader-bg-in',
        'transition-opacity duration-[400ms] ease-smooth',
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100',
      ].join(' ')}
      aria-hidden="true"
    >
      {!reducedMotion ? (
        <div className="flex flex-col items-center text-center px-6">
          <p className="loader-logo-in font-display font-light text-title-lg text-bronze-500 opacity-0">
            Cabral &amp; Souza
          </p>

          <div className="loader-divider-in mt-6 h-px bg-bronze-500 origin-center scale-x-0 w-24" />

          <p className="loader-tagline-in mt-6 font-body font-medium uppercase tracking-eyebrow text-eyebrow text-cream-300/70 opacity-0">
            Galeria de Arte · Desde 1987
          </p>

          <div className="loader-artwork-in mt-10 opacity-0 scale-[0.8]">
            <BandeirinhasPlaceholder />
          </div>
        </div>
      ) : (
        <p className="font-display font-light text-title-md text-bronze-500">Cabral &amp; Souza</p>
      )}
    </div>
  )
}
