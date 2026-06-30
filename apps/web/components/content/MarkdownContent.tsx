import type { ReactNode } from 'react'

interface MarkdownContentProps {
  content: string
  className?: string
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const blocks = content.split('\n\n').filter(Boolean)

  return (
    <div className={`font-body text-[15px] leading-[1.85] text-[--color-ink-muted] ${className}`}>
      {blocks.map((block, i) => {
        if (block.startsWith('# ')) {
          return (
            <h2 key={i} className="font-display text-[2rem] font-light text-[--color-ink] mb-6 mt-10 first:mt-0">
              {block.slice(2)}
            </h2>
          )
        }
        if (block.startsWith('## ')) {
          return (
            <h3 key={i} className="font-display text-[1.5rem] font-light text-[--color-ink] mb-4 mt-8">
              {block.slice(3)}
            </h3>
          )
        }
        if (block.startsWith('### ')) {
          return (
            <h4 key={i} className="font-body text-[13px] uppercase tracking-[0.1em] text-[--color-accent] mb-3 mt-6">
              {block.slice(4)}
            </h4>
          )
        }
        if (block.startsWith('- ')) {
          const items = block.split('\n').filter((l) => l.startsWith('- '))
          return (
            <ul key={i} className="list-disc pl-5 mb-5 space-y-2">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.slice(2))}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="mb-5">
            {renderInline(block)}
          </p>
        )
      })}
    </div>
  )
}
