import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { getSupabaseUrl } from './client'
import { PLACEHOLDER_PIECES } from './pieces'

type Db = SupabaseClient<Database>

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildPlaceholderSvg(params: {
  internalCode: string
  artistName: string
  title: string
}): string {
  const { internalCode, artistName, title } = params
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="#FAFAF7"/>
  <line x1="120" y1="200" x2="1080" y2="200" stroke="#E8E4DC" stroke-width="1"/>
  <line x1="120" y1="1300" x2="1080" y2="1300" stroke="#E8E4DC" stroke-width="1"/>
  <text x="600" y="420" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="42" fill="#1A1A18" letter-spacing="6">CABRAL &amp; SOUZA</text>
  <text x="600" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="16" fill="#8B7355" letter-spacing="4">GALERIA DE ARTE</text>
  <text x="600" y="720" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="#3D3D38">${escapeXml(title)}</text>
  <text x="600" y="780" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#6B6B64" font-style="italic">${escapeXml(artistName)}</text>
  <text x="600" y="1100" text-anchor="middle" font-family="'Courier New', monospace" font-size="18" fill="#8B7355" letter-spacing="3">${escapeXml(internalCode)}</text>
</svg>`
}

async function svgToPng(svg: string): Promise<Buffer> {
  // Dynamic import — sharp optional at typecheck time
  const sharp = (await import('sharp')).default
  return sharp(Buffer.from(svg)).png().toBuffer()
}

const ARTIST_NAMES: Record<string, string> = {
  'di-cavalcanti': 'Emiliano Di Cavalcanti',
  'pedro-americo': 'Pedro Américo',
  djanira: 'Djanira da Motta e Silva',
  'alfredo-volpi': 'Alfredo Volpi',
  'sergio-camargo': 'Sergio de Camargo',
}

export async function seedPieceImages(db: Db): Promise<number> {
  let uploaded = 0

  for (const piece of PLACEHOLDER_PIECES) {
    const { data: row } = await db
      .from('pieces')
      .select('id')
      .eq('internal_code', piece.internal_code)
      .single()

    if (!row) continue

    const { count } = await db
      .from('piece_images')
      .select('id', { count: 'exact', head: true })
      .eq('piece_id', row.id)

    if (count && count > 0) continue

    const artistName = ARTIST_NAMES[piece.artistSlug] ?? piece.artistSlug
    const svg = buildPlaceholderSvg({
      internalCode: piece.internal_code,
      artistName,
      title: piece.title_pt,
    })
    const png = await svgToPng(svg)
    const storagePath = `placeholders/${piece.internal_code}.png`

    const { error: uploadError } = await db.storage
      .from('piece-images')
      .upload(storagePath, png, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) throw new Error(`Upload falhou ${piece.internal_code}: ${uploadError.message}`)

    const publicUrl = `${getSupabaseUrl()}/storage/v1/object/public/piece-images/${storagePath}`

    const { error: insertError } = await db.from('piece_images').insert({
      piece_id: row.id,
      storage_path: storagePath,
      url_original: publicUrl,
      url_large: publicUrl,
      url_medium: publicUrl,
      url_thumbnail: publicUrl,
      alt_text_pt: `${piece.title_pt} — ${artistName}`,
      is_primary: true,
      image_type: 'principal',
      sort_order: 0,
      width_px: 1200,
      height_px: 1500,
      bytes: png.length,
    })

    if (insertError) throw new Error(`Insert imagem falhou ${piece.internal_code}: ${insertError.message}`)
    uploaded++
  }

  return uploaded
}
