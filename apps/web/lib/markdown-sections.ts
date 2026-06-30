/** Gera IDs de âncora estáveis a partir de títulos markdown */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type MarkdownSection = {
  id: string
  title: string
  level: 2 | 3
}

export function extractMarkdownSections(content: string): MarkdownSection[] {
  const sections: MarkdownSection[] = []

  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      const title = line.slice(3).trim()
      sections.push({ id: slugifyHeading(title), title, level: 2 })
    } else if (line.startsWith('### ')) {
      const title = line.slice(4).trim()
      sections.push({ id: slugifyHeading(title), title, level: 3 })
    }
  }

  return sections
}
