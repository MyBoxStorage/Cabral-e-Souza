'use client'

import { useState } from 'react'

interface ShareLinksProps {
  title: string
  url: string
}

export function ShareLinks({ title, url }: ShareLinksProps) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const whatsappText = encodeURIComponent(`${title}\n${url}`)
  const whatsappHref = `https://wa.me/?text=${whatsappText}`

  return (
    <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-[--color-paper-deep]">
      <span className="font-body text-[10px] uppercase tracking-[0.14em] text-[--color-ink-subtle]">
        Compartilhar
      </span>
      <button
        type="button"
        onClick={copyLink}
        className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-paper-deep] hover:border-[--color-accent] px-4 py-2 transition-colors"
      >
        {copied ? 'Link copiado' : 'Copiar link'}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-paper-deep] hover:border-[--color-accent] px-4 py-2 transition-colors"
      >
        WhatsApp
      </a>
    </div>
  )
}
