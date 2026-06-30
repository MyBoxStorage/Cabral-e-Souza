'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
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
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const active = sorted[activeIdx]
  const total = sorted.length

  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return
      setActiveIdx((idx + total) % total)
    },
    [total],
  )

  const openLightbox = useCallback(() => setLightboxOpen(true), [])
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goTo(activeIdx - 1)
      if (e.key === 'ArrowRight') goTo(activeIdx + 1)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen, activeIdx, goTo, closeLightbox])

  if (!active) return null

  const imageSrc = active.url_large ?? active.url_original
  const imageAlt = active.alt_text_pt ?? title

  return (
    <>
      <div className="flex flex-col gap-4">
        <div
          className="relative bg-[--color-paper-muted] overflow-hidden group"
          style={{ aspectRatio: '4/5', maxHeight: '80vh' }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain cursor-zoom-in"
            priority
            onClick={openLightbox}
          />
          <button
            type="button"
            aria-label="Ampliar imagem em tela cheia"
            onClick={openLightbox}
            className="absolute bottom-3 right-3 bg-[--color-ink]/60 text-[--color-paper] p-2 rounded-sm hover:bg-[--color-ink]/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent] opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6"/>
            </svg>
          </button>
        </div>

        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="list" aria-label="Galeria de imagens">
            {sorted.map((img, i) => (
              <button
                key={img.id}
                type="button"
                role="listitem"
                aria-label={`Imagem ${i + 1} de ${total}: ${img.alt_text_pt ?? title}`}
                aria-current={i === activeIdx ? 'true' : undefined}
                onClick={() => setActiveIdx(i)}
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
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada: ${imageAlt}`}
          className="fixed inset-0 z-50 bg-[--color-ink]/95 flex flex-col"
          onClick={closeLightbox}
        >
          <div className="flex items-center justify-between px-4 py-3 text-[--color-paper]">
            <p className="font-body text-[12px] text-[rgba(250,250,247,0.6)] truncate max-w-[50ch]">
              {title}
              {total > 1 && ` · ${activeIdx + 1} / ${total}`}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Fechar visualização"
              className="p-2 hover:text-[--color-accent] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center px-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {total > 1 && (
              <button
                type="button"
                aria-label="Imagem anterior"
                onClick={() => goTo(activeIdx - 1)}
                className="absolute left-2 md:left-6 z-10 p-3 text-[--color-paper] hover:text-[--color-accent] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            <div className="relative w-full h-full max-w-[90vw] max-h-[80vh]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {total > 1 && (
              <button
                type="button"
                aria-label="Próxima imagem"
                onClick={() => goTo(activeIdx + 1)}
                className="absolute right-2 md:right-6 z-10 p-3 text-[--color-paper] hover:text-[--color-accent] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-accent]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
