'use client'

import { useState } from 'react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-cream-200 border-y border-cream-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`

        return (
          <div key={item.question}>
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start justify-between gap-4 py-5 text-left group"
            >
              <span className="font-display text-title-xs text-ink-800 group-hover:text-bronze-500 transition-colors duration-base">
                {item.question}
              </span>
              <span
                aria-hidden
                className={[
                  'shrink-0 font-body text-bronze-500 transition-transform duration-base',
                  isOpen ? 'rotate-45' : '',
                ].join(' ')}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="pb-5 pr-8"
              >
                <p className="font-body text-body text-ink-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
