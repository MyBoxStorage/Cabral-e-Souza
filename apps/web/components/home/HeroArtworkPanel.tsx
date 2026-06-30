'use client'

import { FrameOrnamental, Seal } from '@cabral-souza/ui'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface HeroArtworkPanelProps {
  imageUrl: string
  imageAlt: string
  eyebrow: string
  title: string
  technical: string
  priceLabel: string
}

export function HeroArtworkPanel({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  technical,
  priceLabel,
}: HeroArtworkPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  const isSobConsulta = priceLabel.toLowerCase().includes('sob consulta')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    function onScroll() {
      const el = panelRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      if (rect.bottom < 0 || rect.top > viewportH) return

      const progress = 1 - rect.top / viewportH
      const clamped = Math.max(0, Math.min(1, progress))
      setOffsetY(clamped * 24 - 12)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={panelRef}
      className="w-full max-w-md mx-auto lg:mx-0"
      style={{ transform: offsetY ? `translateY(${offsetY}px)` : undefined }}
    >
      <FrameOrnamental variant="ornate" className="w-full">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={800}
          height={1000}
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="w-full h-auto object-contain"
        />
      </FrameOrnamental>

      <div className="mt-8 w-full">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-3">
          {eyebrow}
        </p>
        <h2 className="font-display font-medium text-title-sm text-ink-800 mb-2 leading-snug">{title}</h2>
        <p className="font-display italic text-caption text-ink-700 mb-4 leading-relaxed">{technical}</p>
        {isSobConsulta ? (
          <Seal variant="curated">Sob consulta</Seal>
        ) : (
          <p className="font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500">
            {priceLabel}
          </p>
        )}
      </div>
    </div>
  )
}
