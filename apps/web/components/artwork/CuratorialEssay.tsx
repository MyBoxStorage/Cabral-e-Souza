interface CuratorialEssayProps {
  title?: string
  content: string
}

export function CuratorialEssay({ title = 'Ensaio curatorial', content }: CuratorialEssayProps) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)
  const first = paragraphs[0] ?? ''
  const rest = paragraphs.slice(1)
  const dropcap = first.charAt(0)
  const firstRest = first.slice(1)

  return (
    <section aria-labelledby="curatorial-essay-heading" className="section-padding bg-cream-100">
      <div className="container-default max-w-narrow mx-auto">
        <p
          id="curatorial-essay-heading"
          className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-8"
        >
          {title}
        </p>

        {first && (
          <p className="font-body text-body-lg text-ink-800 leading-loose mb-6">
            <span className="float-left font-display text-title-lg text-bronze-500 leading-none pr-3 pt-1">
              {dropcap}
            </span>
            {firstRest}
          </p>
        )}

        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="font-body text-body-lg text-ink-800 leading-loose mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
