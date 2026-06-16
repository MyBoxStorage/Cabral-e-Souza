'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { PieceImage } from '../../lib/queries/pieces'

interface ImageGalleryProps {
  images: PieceImage[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.sort_order - b.sort_order
  })

  const [activeIdx, setActiveIdx] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const active = sorted[activeIdx]
  if (!active) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem principal */}
      <div
        className="relative bg-[--color-paper-muted] overflow-hidden"
        style={{ aspectRatio: '4/5', maxHeight: '80vh' }}
      >
        <Image
          src={active.url_large ?? active.url_original}
          alt={active.alt_text_pt ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={[
            'object-contain transition-transform duration-300',
            zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in',
          ].join(' ')}
          priority
          onClick={() => setZoomed((z) => !z)}
        />

        {/* Indicador zoom */}
        {!zoomed && (
          <button
            aria-label="Ampliar imagem"
            onClick={() => setZoomed(true)}
            className="absolute bottom-3 right-3 bg-[--color-ink]/60 text-[--color-paper] p-2 rounded-sm hover:bg-[--color-ink]/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnails — só se tiver mais de 1 imagem */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Galeria de imagens">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              role="listitem"
              aria-label={`Imagem ${i + 1}: ${img.alt_text_pt ?? title}`}
              aria-current={i === activeIdx ? 'true' : undefined}
              onClick={() => { setActiveIdx(i); setZoomed(false) }}
              className={[
                'flex-shrink-0 w-16 h-16 relative overflow-hidden transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]',
                i === activeIdx
                  ? 'ring-1 ring-[--color-accent]'
                  : 'opacity-50 hover:opacity-100',
              ].join(' ')}
            >
              <Image
                src={img.url_thumbnail ?? img.url_medium ?? img.url_original}
                alt={img.alt_text_pt ?? `Imagem ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
