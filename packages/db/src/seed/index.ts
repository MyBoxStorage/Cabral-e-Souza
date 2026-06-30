import { createSeedClient } from './client'
import { seedPieceImages } from './images'
import { runMigrations } from './migrate'
import { seedPieces } from './run-pieces'
import { seedArtists } from './run-artists'
import { seedSitePages } from './run-site-pages'
import { seedBoletim } from './run-boletim'

async function main() {
  console.log('🌱 Cabral & Souza — seed de conteúdo placeholder\n')

  console.log('0/5 Migrations...')
  try {
    await runMigrations()
  } catch (err) {
    console.warn('   ⚠ Migration automática falhou — execute 0002_site_pages.sql manualmente se necessário')
    console.warn('  ', err instanceof Error ? err.message : err)
  }
  console.log()

  const db = createSeedClient()

  console.log('1/5 Peças placeholder...')
  const { created: piecesCreated } = await seedPieces(db)
  console.log(`   ✓ ${piecesCreated} peças novas (10 total no catálogo)\n`)

  console.log('2/5 Verbetes de artistas...')
  const artistsUpdated = await seedArtists(db)
  console.log(`   ✓ ${artistsUpdated} artistas atualizados e publicados\n`)

  console.log('3/5 Páginas institucionais...')
  const pagesCount = await seedSitePages(db)
  console.log(`   ✓ ${pagesCount} páginas\n`)

  console.log('4/5 Posts do boletim...')
  const postsCount = await seedBoletim(db)
  console.log(`   ✓ ${postsCount} posts\n`)

  console.log('5/5 Imagens placeholder...')
  const imagesCount = await seedPieceImages(db)
  console.log(`   ✓ ${imagesCount} imagens enviadas ao bucket piece-images\n`)

  console.log('✅ Seed concluído com sucesso.')
}

main().catch((err) => {
  console.error('❌ Seed falhou:', err)
  process.exit(1)
})
