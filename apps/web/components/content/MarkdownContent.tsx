import type { ReactNode } from 'react'
import { slugifyHeading } from '../../lib/markdown-sections'

interface MarkdownContentProps {
  content: string
  className?: string
  variant?: 'default' | 'editorial'
  dropcap?: boolean
  headingAnchors?: boolean
}

function renderInline(text: string, editorial: boolean): ReactNode[] {
  const parts: ReactNode[] = []
  const regex = /(\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  const linkClass = editorial
    ? 'text-bronze-500 hover:underline underline-offset-4'
    : 'text-[--color-accent] hover:underline underline-offset-2'

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      if (linkMatch) {
        const [, label, href] = linkMatch
        if (label && href) {
          const isExternal = href.startsWith('http')
          parts.push(
            <a
              key={key++}
              href={href}
              className={linkClass}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {label}
            </a>,
          )
        }
      }
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key++} className={editorial ? 'font-display italic text-ink-800' : undefined}>
          {token.slice(1, -1)}
        </em>,
      )
    }
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith('|') && line.trim().endsWith('|')
}

function parseTable(block: string): string[][] {
  const lines = block.split('\n').filter((l) => isTableRow(l))
  return lines
    .filter((l) => !/^\|[\s\-:|]+\|$/.test(l.trim()))
    .map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
}

function DropcapParagraph({ children }: { children: ReactNode }) {
  const text = typeof children === 'string' ? children : null
  if (!text || text.length === 0) {
    return <p className="mb-6 font-body text-body-lg text-ink-800 leading-loose">{children}</p>
  }

  return (
    <p className="editorial-dropcap mb-6 font-body text-body-lg text-ink-800 leading-loose">
      {text}
    </p>
  )
}

export function MarkdownContent({
  content,
  className = '',
  variant = 'default',
  dropcap = false,
  headingAnchors = false,
}: MarkdownContentProps) {
  const editorial = variant === 'editorial'
  const blocks = content.split('\n\n').filter(Boolean)
  let firstParagraph = true

  const wrapperClass = editorial
    ? `font-body text-body-lg leading-loose text-ink-800 ${className}`
    : `font-body text-[15px] leading-[1.85] text-[--color-ink-muted] ${className}`

  return (
    <div className={wrapperClass}>
      {blocks.map((block, i) => {
        if (block.startsWith('> ')) {
          const quote = block
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join(' ')
          return (
            <blockquote
              key={i}
              className="my-10 border-l-2 border-bronze-500 pl-8 font-display italic text-title-xs text-ink-800 leading-snug"
            >
              {renderInline(quote, editorial)}
            </blockquote>
          )
        }

        if (block.startsWith('# ')) {
          const heading = block.slice(2)
          return (
            <h2
              key={i}
              className={
                editorial
                  ? 'font-display text-title-md font-normal text-ink-800 mb-6 mt-12 first:mt-0'
                  : 'font-display text-[2rem] font-light text-[--color-ink] mb-6 mt-10 first:mt-0'
              }
            >
              {heading}
            </h2>
          )
        }
        if (block.startsWith('## ')) {
          const heading = block.slice(3)
          return (
            <h3
              key={i}
              id={headingAnchors ? slugifyHeading(heading) : undefined}
              className={
                editorial
                  ? 'font-display text-title-sm font-normal text-ink-800 mb-4 mt-10 scroll-mt-28'
                  : 'font-display text-[1.5rem] font-light text-[--color-ink] mb-4 mt-8'
              }
            >
              {heading}
            </h3>
          )
        }
        if (block.startsWith('### ')) {
          const heading = block.slice(4)
          return (
            <h4
              key={i}
              id={headingAnchors ? slugifyHeading(heading) : undefined}
              className={
                editorial
                  ? 'font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500 mb-3 mt-8 scroll-mt-28'
                  : 'font-body text-[13px] uppercase tracking-[0.1em] text-[--color-accent] mb-3 mt-6'
              }
            >
              {heading}
            </h4>
          )
        }
        if (block.split('\n').every(isTableRow)) {
          const rows = parseTable(block)
          if (rows.length === 0) return null
          const [header, ...body] = rows
          return (
            <div key={i} className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse text-body-sm">
                <thead>
                  <tr className={editorial ? 'border-b border-bronze-500/30' : 'border-b border-[--color-paper-deep]'}>
                    {header?.map((cell, j) => (
                      <th
                        key={j}
                        scope="col"
                        className={
                          editorial
                            ? 'py-3 pr-4 text-left font-body font-medium uppercase tracking-caps text-eyebrow text-bronze-500'
                            : 'py-3 pr-4 text-left font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle]'
                        }
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr
                      key={ri}
                      className={editorial ? 'border-b border-cream-200' : 'border-b border-[--color-paper-deep]'}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={
                            editorial
                              ? 'py-3 pr-4 text-ink-800'
                              : 'py-3 pr-4 text-[--color-ink-muted]'
                          }
                        >
                          {renderInline(cell, editorial)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        if (block.startsWith('- ')) {
          const items = block.split('\n').filter((l) => l.startsWith('- '))
          return (
            <ul key={i} className="list-disc pl-5 mb-6 space-y-2">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.slice(2), editorial)}</li>
              ))}
            </ul>
          )
        }

        const inline = renderInline(block, editorial)
        const useDropcap = editorial && dropcap && firstParagraph
        if (useDropcap) firstParagraph = false

        if (useDropcap && typeof block === 'string') {
          return <DropcapParagraph key={i}>{block}</DropcapParagraph>
        }

        return (
          <p key={i} className={editorial ? 'mb-6' : 'mb-5'}>
            {inline}
          </p>
        )
      })}
    </div>
  )
}
