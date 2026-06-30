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
  const sharp = (await import('sharp')).default
  const jpeg = await sharp(raw)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer()

  writeFileSync(localPath, jpeg)
  return jpeg
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
    const jpeg = await downloadToAssets(slug)
    const storagePath = `${ARTIST_PORTRAIT_STORAGE_PREFIX}/${source.filename}`

    const { error: uploadError } = await db.storage
      .from('piece-images')
      .upload(storagePath, jpeg, {
        contentType: 'image/jpeg',
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
