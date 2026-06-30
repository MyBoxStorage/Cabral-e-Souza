import type { ReactNode } from 'react'

interface MarkdownContentProps {
  content: string
  className?: string
}

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const regex = /(\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

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
              className="text-[--color-accent] hover:underline underline-offset-2"
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {label}
            </a>,
          )
        }
      }
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>)
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
        if (block.split('\n').every(isTableRow)) {
          const rows = parseTable(block)
          if (rows.length === 0) return null
          const [header, ...body] = rows
          return (
            <div key={i} className="mb-6 overflow-x-auto">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-[--color-paper-deep]">
                    {header?.map((cell, j) => (
                      <th
                        key={j}
                        scope="col"
                        className="py-3 pr-4 text-left font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle]"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} className="border-b border-[--color-paper-deep]">
                      {row.map((cell, ci) => (
                        <td key={ci} className="py-3 pr-4 text-[--color-ink-muted]">
                          {renderInline(cell)}
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
