import Link from 'next/link'
import type { MarkdownSection } from '../../lib/markdown-sections'

interface LegalTableOfContentsProps {
  sections: MarkdownSection[]
}

export function LegalTableOfContents({ sections }: LegalTableOfContentsProps) {
  if (sections.length === 0) return null

  return (
    <nav aria-label="Sumário da página" className="lg:sticky lg:top-28 lg:self-start">
      <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
        Sumário
      </p>
      <ul className="flex flex-col gap-2 list-none">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={`#${section.id}`}
              className={[
                'inline-block font-body text-body-sm text-ink-700 hover:text-bronze-500 transition-colors duration-base',
                'border border-cream-200 bg-cream-100 px-3 py-2 w-full',
                section.level === 3 ? 'ml-3 text-body-sm' : '',
              ].join(' ')}
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
