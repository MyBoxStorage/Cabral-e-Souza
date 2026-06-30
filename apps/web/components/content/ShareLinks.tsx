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

  const buttonClass =
    'font-body text-eyebrow font-medium uppercase tracking-caps text-ink-800 border border-cream-200 hover:border-bronze-500 hover:text-bronze-500 px-5 py-2.5 transition-colors duration-base'

  return (
    <div className="flex flex-wrap items-center gap-4 pt-10 mt-10 border-t border-cream-200">
      <span className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500">
        Compartilhar
      </span>
      <button type="button" onClick={copyLink} className={buttonClass}>
        {copied ? 'Link copiado' : 'Copiar link'}
      </button>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        WhatsApp
      </a>
    </div>
  )
}
