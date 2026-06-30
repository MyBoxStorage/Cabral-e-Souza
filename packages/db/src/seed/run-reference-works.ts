import { createSeedClient } from './client'
import { seedReferenceWorkImages } from './reference-works'
import { seedBoletimHeroImages } from './boletim-heroes'

const force = process.argv.includes('--force')

async function main() {
  console.log('🖼  Cabral & Souza — imagens de referência (obras + boletim)\n')
  const db = createSeedClient()

  console.log('1/2 Obras de referência (Wikimedia + watermark)...')
  const works = await seedReferenceWorkImages(db, { force })
  console.log(`   ✓ ${works} peças atualizadas\n`)

  console.log('2/2 Heroes do boletim (1600×900)...')
  const heroes = await seedBoletimHeroImages(db, { force })
  console.log(`   ✓ ${heroes} posts atualizados\n`)

  console.log('✅ Concluído.')
}

main().catch((err) => {
  console.error('❌ Falhou:', err)
  process.exit(1)
})
