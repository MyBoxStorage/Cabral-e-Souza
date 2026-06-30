import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { getSupabaseUrl } from './client'
import { PLACEHOLDER_PIECES } from './pieces'
import {
  WORK_IMAGE_SOURCES,
  WORK_IMAGE_STORAGE_PREFIX,
  type WorkImageSource,
} from './content/works/work-image-sources'

type Db = SupabaseClient<Database>

const WIKIMEDIA_USER_AGENT =
  'CabralSouzaSeed/1.0 (https://cabralesouza.com.br; contact: contato@cabralesouza.com.br)'

const ASSETS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), 'assets/works')

const ARTIST_NAMES: Record<string, string> = {
  'di-cavalcanti': 'Emiliano Di Cavalcanti',
  'pedro-americo': 'Pedro Américo',
  djanira: 'Djanira da Motta e Silva',
  'alfredo-volpi': 'Alfredo Volpi',
  'sergio-camargo': 'Sergio de Camargo',
}

const SIZES = {
  original: { maxWidth: 1600, suffix: 'original' },
  large: { maxWidth: 1200, suffix: 'large' },
  medium: { maxWidth: 800, suffix: 'medium' },
  thumbnail: { maxWidth: 400, suffix: 'thumb' },
} as const

function buildVolpiBandeirinhasSvg(): string {
  const colors = ['#c0392b', '#f1c40f', '#1e8449', '#2471a3', '#d35400', '#8e44ad', '#16a085']
  const rects = colors
    .map((c, i) => {
      const x = 80 + i * 145
      return `<rect x="${x}" y="120" width="110" height="1240" fill="${c}" opacity="0.92"/>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="#f5f0e8"/>
  ${rects}
  <rect width="1200" height="1500" fill="url(#grain)" opacity="0.04"/>
  <defs>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/></filter>
  </defs>
</svg>`
}

function buildVolpiFachadaSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="#e8ede4"/>
  <rect x="180" y="200" width="840" height="1100" fill="#3d6b4f"/>
  <rect x="260" y="340" width="120" height="160" fill="#1a3328"/>
  <rect x="460" y="340" width="120" height="160" fill="#f4e4bc"/>
  <rect x="660" y="340" width="120" height="160" fill="#1a3328"/>
  <rect x="360" y="620" width="200" height="280" fill="#8b4513"/>
  <rect x="620" y="620" width="120" height="280" fill="#f4e4bc"/>
  <rect x="260" y="980" width="520" height="40" fill="#c9a227"/>
</svg>`
}

async function generateReferenceImage(generator: 'volpi-bandeirinhas' | 'volpi-fachada'): Promise<Buffer> {
  const sharp = (await import('sharp')).default
  const svg = generator === 'volpi-bandeirinhas' ? buildVolpiBandeirinhasSvg() : buildVolpiFachadaSvg()
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function downloadWikimedia(url: string, filename: string): Promise<Buffer> {
  mkdirSync(ASSETS_DIR, { recursive: true })
  const localPath = resolve(ASSETS_DIR, filename.replace('.webp', '-raw'))

  if (existsSync(localPath)) {
    return readFileSync(localPath)
  }

  const res = await fetch(url, { headers: { 'User-Agent': WIKIMEDIA_USER_AGENT } })
  if (!res.ok) {
    throw new Error(`Download falhou: HTTP ${res.status} — ${url}`)
  }

  const raw = Buffer.from(await res.arrayBuffer())
  writeFileSync(localPath, raw)
  return raw
}

async function applyWatermark(image: Buffer, width: number, height: number): Promise<Buffer> {
  const sharp = (await import('sharp')).default
  const fontSize = Math.max(13, Math.round(width * 0.016))
  const pad = Math.round(fontSize * 0.9)

  const label = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="${width - pad - fontSize * 11}" y="${height - pad - fontSize * 1.4}"
    width="${fontSize * 11}" height="${fontSize * 1.6}" fill="rgba(26,26,24,0.45)" rx="2"/>
  <text x="${width - pad}" y="${height - pad}"
    text-anchor="end" font-family="Georgia, 'Times New Roman', serif"
    font-size="${fontSize}" fill="rgba(250,250,247,0.9)" letter-spacing="1.5">
    ACERVO DE REFERÊNCIA
  </text>
</svg>`)

  return sharp(image).composite([{ input: label, top: 0, left: 0 }]).toBuffer()
}

async function buildVariants(raw: Buffer): Promise<{
  buffers: Record<keyof typeof SIZES, Buffer>
  meta: { width: number; height: number }
}> {
  const sharp = (await import('sharp')).default
  const normalized = await sharp(raw, { limitInputPixels: false })
    .rotate()
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .toBuffer()

  const meta = await sharp(normalized).metadata()
  const baseWidth = meta.width ?? 1200
  const baseHeight = meta.height ?? 1500

  const watermarked = await applyWatermark(normalized, baseWidth, baseHeight)

  const buffers = {} as Record<keyof typeof SIZES, Buffer>
  for (const [key, cfg] of Object.entries(SIZES) as [keyof typeof SIZES, (typeof SIZES)[keyof typeof SIZES]][]) {
    buffers[key] = await sharp(watermarked)
      .resize({ width: cfg.maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
  }

  return { buffers, meta: { width: baseWidth, height: baseHeight } }
}

async function resolveSourceBuffer(source: WorkImageSource): Promise<Buffer> {
  if (source.type === 'wikimedia') {
    return downloadWikimedia(source.url, source.filename)
  }
  return generateReferenceImage(source.generator)
}

function publicUrl(storagePath: string): string {
  return `${getSupabaseUrl()}/storage/v1/object/public/piece-images/${storagePath}`
}

export async function seedReferenceWorkImages(db: Db, options: { force?: boolean } = {}): Promise<number> {
  const { force = false } = options
  let uploaded = 0

  for (const piece of PLACEHOLDER_PIECES) {
    const source = WORK_IMAGE_SOURCES[piece.internal_code]
    if (!source) {
      console.warn(`   ⚠ Sem fonte para ${piece.internal_code}`)
      continue
    }

    const { data: row } = await db
      .from('pieces')
      .select('id')
      .eq('internal_code', piece.internal_code)
      .single()

    if (!row) continue

    if (!force) {
      const { data: existing } = await db
        .from('piece_images')
        .select('storage_path')
        .eq('piece_id', row.id)
        .limit(1)
        .maybeSingle()

      if (existing?.storage_path?.startsWith(`${WORK_IMAGE_STORAGE_PREFIX}/`)) {
        continue
      }
    } else {
      await db.from('piece_images').delete().eq('piece_id', row.id)
    }

    const raw = await resolveSourceBuffer(source)
    const { buffers, meta } = await buildVariants(raw)
    const artistName = ARTIST_NAMES[piece.artistSlug] ?? piece.artistSlug
    const basePath = `${WORK_IMAGE_STORAGE_PREFIX}/${piece.internal_code}`

    const paths: Record<keyof typeof SIZES, string> = {
      original: `${basePath}/${source.filename.replace('.webp', '-original.webp')}`,
      large: `${basePath}/${source.filename.replace('.webp', '-large.webp')}`,
      medium: `${basePath}/${source.filename.replace('.webp', '-medium.webp')}`,
      thumbnail: `${basePath}/${source.filename.replace('.webp', '-thumb.webp')}`,
    }

    for (const [key, buffer] of Object.entries(buffers) as [keyof typeof SIZES, Buffer][]) {
      const { error } = await db.storage.from('piece-images').upload(paths[key], buffer, {
        contentType: 'image/webp',
        upsert: true,
      })
      if (error) throw new Error(`Upload ${paths[key]}: ${error.message}`)
    }

    const substituteNote =
      source.type === 'wikimedia' ? source.substituteNote : source.substituteNote
    const altBase = `${piece.title_pt} — ${artistName}. ${substituteNote ?? ''}`.trim()

    const { error: insertError } = await db.from('piece_images').insert({
      piece_id: row.id,
      storage_path: paths.original,
      url_original: publicUrl(paths.original),
      url_large: publicUrl(paths.large),
      url_medium: publicUrl(paths.medium),
      url_thumbnail: publicUrl(paths.thumbnail),
      alt_text_pt: altBase,
      is_primary: true,
      image_type: 'principal',
      sort_order: 0,
      width_px: meta.width,
      height_px: meta.height,
      bytes: buffers.original.length,
    })

    if (insertError) throw new Error(`Insert ${piece.internal_code}: ${insertError.message}`)

    console.log(`   ✓ ${piece.internal_code} → ${paths.large}`)
    uploaded++
  }

  return uploaded
}
