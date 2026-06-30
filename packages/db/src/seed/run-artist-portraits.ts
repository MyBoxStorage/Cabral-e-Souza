import { createSeedClient } from './client'
import { seedArtistPortraits } from './artist-portraits'

async function main() {
  console.log('📷 Upload de retratos de artistas (Wikimedia → Supabase Storage)\n')
  const db = createSeedClient()
  const count = await seedArtistPortraits(db)
  console.log(`✅ ${count} retratos enviados para piece-images/artist-portraits/`)
}

main().catch((err) => {
  console.error('❌', err)
  process.exit(1)
})
