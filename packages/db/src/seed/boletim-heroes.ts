import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { getSupabaseUrl } from './client'
import { BOLETIM_POSTS } from './content/boletim'

type Db = SupabaseClient<Database>

const CATEGORY_LABELS: Record<string, string> = {
  analise_leilao: 'Análise de Leilão',
  verbete_artista: 'Verbete',
  mercado: 'Mercado',
  editorial: 'Editorial',
  noticia: 'Notícia',
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function wrapTitle(title: string, maxCharsPerLine = 42): string[] {
  const words = title.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxCharsPerLine && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 4)
}

function buildBoletimHeroSvg(params: { title: string; category: string }): string {
  const { title, category } = params
  const label = CATEGORY_LABELS[category] ?? category
  const lines = wrapTitle(title)
  const lineHeight = 52
  const startY = 420 - ((lines.length - 1) * lineHeight) / 2
  const titleTspans = lines
    .map((line, i) => {
      const y = startY + i * lineHeight
      return `<tspan x="800" y="${y}">${escapeXml(line)}</tspan>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFAF7"/>
      <stop offset="45%" stop-color="#F0EBE3"/>
      <stop offset="100%" stop-color="#E8E0D4"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <line x1="120" y1="140" x2="1480" y2="140" stroke="#D4C9B8" stroke-width="1"/>
  <line x1="120" y1="760" x2="1480" y2="760" stroke="#D4C9B8" stroke-width="1"/>
  <text x="800" y="220" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
    font-size="13" fill="#8B7355" letter-spacing="6">CABRAL &amp; SOUZA</text>
  <text x="800" y="280" text-anchor="middle" font-family="Georgia, serif"
    font-size="11" fill="#A89880" letter-spacing="4">BOLETIM</text>
  <text x="800" y="340" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif"
    font-size="12" fill="#8B7355" letter-spacing="3">${escapeXml(label.toUpperCase())}</text>
  <text text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
    font-size="34" fill="#1A1A18" font-weight="300">
    ${titleTspans}
  </text>
  <circle cx="1320" cy="180" r="48" fill="none" stroke="#C4B5A0" stroke-width="1"/>
  <text x="1320" y="188" text-anchor="middle" font-family="Georgia, serif"
    font-size="28" fill="#8B7355">C&amp;S</text>
</svg>`
}

function publicUrl(storagePath: string): string {
  return `${getSupabaseUrl()}/storage/v1/object/public/piece-images/${storagePath}`
}

export async function seedBoletimHeroImages(db: Db, options: { force?: boolean } = {}): Promise<number> {
  const { force = false } = options
  const sharp = (await import('sharp')).default
  let uploaded = 0

  for (const post of BOLETIM_POSTS) {
    const { data: row } = await db
      .from('boletim_posts')
      .select('id, hero_image_url')
      .eq('slug', post.slug)
      .single()

    if (!row) continue
    if (!force && row.hero_image_url?.includes('/boletim/')) continue

    const svg = buildBoletimHeroSvg({ title: post.title_pt, category: post.category })
    const png = await sharp(Buffer.from(svg)).png().toBuffer()
    const storagePath = `boletim/${post.slug}.png`

    const { error: uploadError } = await db.storage.from('piece-images').upload(storagePath, png, {
      contentType: 'image/png',
      upsert: true,
    })
    if (uploadError) throw new Error(`Upload boletim ${post.slug}: ${uploadError.message}`)

    const hero_image_url = publicUrl(storagePath)
    const { error: updateError } = await db
      .from('boletim_posts')
      .update({ hero_image_url, updated_at: new Date().toISOString() })
      .eq('id', row.id)

    if (updateError) throw new Error(`Update boletim ${post.slug}: ${updateError.message}`)

    console.log(`   ✓ ${post.slug}`)
    uploaded++
  }

  return uploaded
}
