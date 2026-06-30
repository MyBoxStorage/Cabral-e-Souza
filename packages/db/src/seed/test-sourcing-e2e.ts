/**
 * Teste E2E do fluxo /vender-obra: insert em sourcing_leads + upload no bucket.
 * Uso: pnpm --filter=@cabral-souza/db exec tsx src/seed/test-sourcing-e2e.ts
 */
import { createSeedClient } from './client'

// PNG 1×1 mínimo
const TEST_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

async function main() {
  const db = createSeedClient()
  const testId = crypto.randomUUID()
  const path = `e2e-test/${testId}.png`

  console.log('📤 Uploading test photo...')
  const { error: uploadError } = await db.storage
    .from('sourcing-uploads')
    .upload(path, TEST_PNG, { contentType: 'image/png', upsert: false })

  if (uploadError) {
    console.error('❌ Upload failed:', uploadError.message)
    process.exit(1)
  }
  console.log('   ✓ Photo uploaded:', path)

  const photoEntry = { path, url: '' }
  const sellerEmail = `e2e-${testId.slice(0, 8)}@test.cabralesouza.local`

  console.log('📝 Inserting sourcing_lead...')
  const { data: lead, error: insertError } = await db
    .from('sourcing_leads')
    .insert({
      seller_name: 'E2E Test Vendedor',
      seller_email: sellerEmail,
      seller_phone: '11999998888',
      seller_city: 'São Paulo',
      artist_claimed: 'Artista Teste',
      technique_claimed: 'pintura',
      dimensions_claimed: '50 × 40 cm',
      acquisition_history: 'Obra adquirida em leilão de teste automatizado E2E.',
      expected_value_brl: 50000,
      has_documents: true,
      photos: [photoEntry],
      notes_internal: 'Faixa expectativa: 20_80k',
      consent_data: true,
      consent_at: new Date().toISOString(),
      status: 'aguardando_analise',
    })
    .select('id, photos')
    .single()

  if (insertError || !lead) {
    console.error('❌ Insert failed:', insertError?.message)
    await db.storage.from('sourcing-uploads').remove([path])
    process.exit(1)
  }
  console.log('   ✓ Lead created:', lead.id)

  const { data: files } = await db.storage.from('sourcing-uploads').list('e2e-test')
  const found = files?.some((f) => f.name === `${testId}.png`)
  console.log(found ? '   ✓ File visible in bucket listing' : '❌ File not in bucket listing')

  const { data: row } = await db
    .from('sourcing_leads')
    .select('seller_email, photos, status')
    .eq('id', lead.id)
    .single()

  const photosOk = Array.isArray(row?.photos) && (row.photos as { path: string }[]).length === 1
  console.log(photosOk ? '   ✓ photos JSONB persisted' : '❌ photos missing')
  console.log(row?.status === 'aguardando_analise' ? '   ✓ status aguardando_analise' : '❌ wrong status')

  // Cleanup test data
  await db.from('sourcing_leads').delete().eq('id', lead.id)
  await db.storage.from('sourcing-uploads').remove([path])
  console.log('\n🧹 Test data cleaned up')
  console.log('\n✅ E2E sourcing flow OK')
}

main().catch((err) => {
  console.error('💥', err.message)
  process.exit(1)
})
