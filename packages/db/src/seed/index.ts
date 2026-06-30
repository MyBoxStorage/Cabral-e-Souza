import { createSeedClient } from './client'
import { seedArtistPortraits } from './artist-portraits'
import { seedPieceImages } from './images'
import { seedReferenceWorkImages } from './reference-works'
import { seedBoletimHeroImages } from './boletim-heroes'
import { runMigrations } from './migrate'
import { seedPieces } from './run-pieces'
import { seedArtists } from './run-artists'
import { seedSitePages } from './run-site-pages'
import { seedBoletim } from './run-boletim'

async function main() {
  console.log('🌱 Cabral & Souza — seed de conteúdo placeholder\n')

  console.log('0/6 Migrations...')
  try {
    await runMigrations()
  } catch (err) {
    console.warn('   ⚠ Migration automática falhou — execute 0002_site_pages.sql manualmente se necessário')
    console.warn('  ', err instanceof Error ? err.message : err)
  }
  console.log()

  const db = createSeedClient()

  console.log('1/6 Peças placeholder...')
  const { created: piecesCreated } = await seedPieces(db)
  console.log(`   ✓ ${piecesCreated} peças novas (10 total no catálogo)\n`)

  console.log('2/6 Retratos de artistas (Wikimedia → Storage)...')
  const portraitsCount = await seedArtistPortraits(db)
  console.log(`   ✓ ${portraitsCount} retratos em piece-images/artist-portraits/\n`)

  console.log('3/6 Verbetes de artistas...')
  const artistsUpdated = await seedArtists(db)
  console.log(`   ✓ ${artistsUpdated} artistas atualizados e publicados\n`)

  console.log('4/6 Páginas institucionais...')
  const pagesCount = await seedSitePages(db)
  console.log(`   ✓ ${pagesCount} páginas\n`)

  console.log('5/6 Posts do boletim...')
  const postsCount = await seedBoletim(db)
  console.log(`   ✓ ${postsCount} posts\n`)

  console.log('6/7 Imagens placeholder (tipográficas — fallback)...')
  const imagesCount = await seedPieceImages(db)
  console.log(`   ✓ ${imagesCount} imagens tipográficas (ignoradas se works/ já existir)\n`)

  console.log('7/7 Imagens de referência (obras DP + boletim)...')
  const worksCount = await seedReferenceWorkImages(db, { force: true })
  const heroesCount = await seedBoletimHeroImages(db, { force: true })
  console.log(`   ✓ ${worksCount} obras + ${heroesCount} heroes boletim\n`)

  console.log('✅ Seed concluído com sucesso.')
}

main().catch((err) => {
  console.error('❌ Seed falhou:', err)
  process.exit(1)
})
