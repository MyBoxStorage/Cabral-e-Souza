import { runMigrations, verifySitePagesTable } from './migrate'
import { seedSitePages } from './run-site-pages'
import { createSeedClient } from './client'

async function main() {
  console.log('📦 Aplicando migrations...\n')
  await runMigrations()

  const ok = await verifySitePagesTable()
  console.log(ok ? '\n✅ Tabela site_pages confirmada.' : '\n⚠ site_pages não encontrada.')

  if (ok) {
    console.log('\n🌱 Populando site_pages...')
    const db = createSeedClient()
    const count = await seedSitePages(db)
    console.log(`   ✓ ${count} páginas upserted`)
  }
}

main().catch((err) => {
  console.error('❌ Migration falhou:', err.message)
  process.exit(1)
})
