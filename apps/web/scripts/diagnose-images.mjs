#!/usr/bin/env node
/**
 * Lista peças públicas e verifica HTTP status das URLs de imagem (hero + piece_images).
 *
 * Uso:
 *   pnpm --filter web diagnose:images
 *   pnpm --filter web diagnose:images -- --baseUrl=https://cabral-e-souza-2o2k.vercel.app
 */

import { createClient } from '@supabase/supabase-js'

const baseUrlArg = process.argv.find((a) => a.startsWith('--baseUrl='))?.split('=')[1]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const db = createClient(supabaseUrl, serviceKey)

async function checkUrl(url, viaNextImage = false) {
  const target = viaNextImage && baseUrlArg
    ? `${baseUrlArg}/_next/image?url=${encodeURIComponent(url)}&w=640&q=75`
    : url

  try {
    const res = await fetch(target, { method: 'HEAD', redirect: 'follow' })
    if (res.status === 405 || res.status === 501) {
      const getRes = await fetch(target, { redirect: 'follow' })
      return getRes.status
    }
    return res.status
  } catch (err) {
    return `ERR ${err instanceof Error ? err.message : String(err)}`
  }
}

const { data: pieces, error } = await db
  .from('pieces')
  .select(`
    id, internal_code, slug, title_pt,
    piece_images(id, url_original, url_large, url_medium, url_thumbnail, is_primary)
  `)
  .in('status', ['publico', 'reservado'])
  .order('internal_code')

if (error) {
  console.error(error.message)
  process.exit(1)
}

let ok = 0
let fail = 0

console.log(`\nDiagnóstico de imagens — ${pieces?.length ?? 0} peças\n`)
if (baseUrlArg) console.log(`Next/Image via: ${baseUrlArg}\n`)

for (const piece of pieces ?? []) {
  const images = piece.piece_images ?? []
  console.log(`${piece.internal_code} · ${piece.title_pt} (${piece.slug})`)

  if (images.length === 0) {
    console.log('  ⚠ sem piece_images')
    fail++
    continue
  }

  for (const img of images) {
    const url = img.url_large ?? img.url_original
    if (!url) {
      console.log(`  ⚠ imagem ${img.id}: sem URL`)
      fail++
      continue
    }

    const direct = await checkUrl(url)
    const optimized = baseUrlArg ? await checkUrl(url, true) : null

    const primary = img.is_primary ? ' [primary]' : ''
    const directOk = direct === 200
    const optOk = optimized === null || optimized === 200

    if (directOk && optOk) {
      ok++
      console.log(`  ✓ ${direct}${optimized !== null ? ` / next:${optimized}` : ''}${primary}`)
    } else {
      fail++
      console.log(`  ✗ direct:${direct}${optimized !== null ? ` next:${optimized}` : ''} ${url}${primary}`)
    }
  }
}

const { data: posts } = await db
  .from('boletim_posts')
  .select('slug, title_pt, hero_image_url')
  .eq('is_published', true)

console.log(`\nBoletim (${posts?.length ?? 0} posts)\n`)
for (const post of posts ?? []) {
  if (!post.hero_image_url) {
    console.log(`  ○ ${post.slug}: sem hero_image_url (fallback UI)`)
    continue
  }
  const status = await checkUrl(post.hero_image_url)
  if (status === 200) {
    ok++
    console.log(`  ✓ ${post.slug}: ${status}`)
  } else {
    fail++
    console.log(`  ✗ ${post.slug}: ${status} — ${post.hero_image_url}`)
  }
}

console.log(`\nResumo: ${ok} OK, ${fail} falhas\n`)
process.exit(fail > 0 ? 1 : 0)
