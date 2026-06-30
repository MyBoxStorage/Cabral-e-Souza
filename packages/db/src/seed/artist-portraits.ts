import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import { getSupabaseUrl } from './client'
import {
  ARTIST_PORTRAIT_SOURCES,
  ARTIST_PORTRAIT_STORAGE_PREFIX,
} from './content/artists/portrait-sources'

type Db = SupabaseClient<Database>

const WIKIMEDIA_USER_AGENT =
  'CabralSouzaSeed/1.0 (https://cabralesouza.com.br; contact: contato@cabralesouza.com.br)'

const ASSETS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), 'assets/artist-portraits')
const MAX_WIDTH = 800
const TARGET_MAX_BYTES = 80 * 1024

async function optimizePortrait(raw: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default
  let quality = 75
  let webp = await sharp(raw)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()

  while (webp.length > TARGET_MAX_BYTES && quality > 50) {
    quality -= 5
    webp = await sharp(raw)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()
  }

  return webp
}

async function downloadToAssets(slug: string): Promise<Buffer> {
  const source = ARTIST_PORTRAIT_SOURCES[slug]
  if (!source) throw new Error(`Sem fonte Wikimedia para ${slug}`)

  mkdirSync(ASSETS_DIR, { recursive: true })
  const localPath = resolve(ASSETS_DIR, source.filename)

  if (existsSync(localPath)) {
    return readFileSync(localPath)
  }

  const res = await fetch(source.url, {
    headers: { 'User-Agent': WIKIMEDIA_USER_AGENT },
  })
  if (!res.ok) {
    throw new Error(`Download falhou ${slug}: HTTP ${res.status} — ${source.url}`)
  }

  const raw = Buffer.from(await res.arrayBuffer())
  const webp = await optimizePortrait(raw)

  writeFileSync(localPath, webp)
  console.log(`   ${slug}: ${(webp.length / 1024).toFixed(1)} KB`)
  return webp
}

export function portraitPublicUrl(slug: string): string {
  const source = ARTIST_PORTRAIT_SOURCES[slug]
  if (!source) throw new Error(`Sem retrato para ${slug}`)
  const storagePath = `${ARTIST_PORTRAIT_STORAGE_PREFIX}/${source.filename}`
  return `${getSupabaseUrl()}/storage/v1/object/public/piece-images/${storagePath}`
}

export async function seedArtistPortraits(db: Db): Promise<number> {
  let uploaded = 0

  for (const slug of Object.keys(ARTIST_PORTRAIT_SOURCES)) {
    const source = ARTIST_PORTRAIT_SOURCES[slug]
    const webp = await downloadToAssets(slug)
    const storagePath = `${ARTIST_PORTRAIT_STORAGE_PREFIX}/${source.filename}`

    const { error: uploadError } = await db.storage
      .from('piece-images')
      .upload(storagePath, webp, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (uploadError) {
      throw new Error(`Upload retrato ${slug}: ${uploadError.message}`)
    }

    const hero_image_url = portraitPublicUrl(slug)
    const { error: updateError } = await db
      .from('artists')
      .update({ hero_image_url, updated_at: new Date().toISOString() })
      .eq('slug', slug)

    if (updateError) throw new Error(`Update artista ${slug}: ${updateError.message}`)
    uploaded++
  }

  return uploaded
}

/** URLs públicas Supabase para uso em seeds estáticos / documentação */
export function buildArtistHeroImageMap(): Record<string, string> {
  return Object.fromEntries(
    Object.keys(ARTIST_PORTRAIT_SOURCES).map((slug) => [slug, portraitPublicUrl(slug)]),
  )
}
