'use server'

import { createAdminClient } from '@cabral-souza/db'
import { z } from 'zod'

const VALUE_RANGE_MAP: Record<string, number | null> = {
  ate_20k: 15000,
  '20_80k': 50000,
  '80_300k': 150000,
  '300k_mais': 350000,
  nao_sei: null,
}

const SourcingSchema = z.object({
  seller_name: z.string().min(2),
  seller_email: z.string().email(),
  seller_phone: z.string().min(8),
  seller_city: z.string().min(2),
  technique_claimed: z.enum([
    'pintura', 'escultura', 'desenho', 'gravura', 'fotografia', 'objeto', 'antiguidade',
  ]),
  artist_claimed: z.string().optional(),
  dimensions_claimed: z.string().optional(),
  acquisition_history: z.string().min(10),
  value_range: z.enum(['ate_20k', '20_80k', '80_300k', '300k_mais', 'nao_sei']),
  consent_data: z.literal('true'),
})

export async function submitSourcingLead(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = SourcingSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors.map((e) => e.message).join(', ') }
  }

  const data = parsed.data
  const db = createAdminClient()

  // Garante bucket (caso migration 0003 ainda não aplicada)
  await db.storage.createBucket('sourcing-uploads', {
    public: false,
    fileSizeLimit: 52428800,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  })

  const photoUrls: { path: string; url: string }[] = []
  const files = formData.getAll('photos') as File[]
  const validFiles = files.filter((f) => f && f.size > 0).slice(0, 8)

  for (const file of validFiles) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${crypto.randomUUID()}/${crypto.randomUUID()}.${ext}`

    const bucket = 'sourcing-uploads'
    const { error: uploadError } = await db.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[submitSourcingLead] upload', uploadError.message)
      continue
    }

    const { data: urlData } = db.storage.from(bucket).getPublicUrl(path)
    photoUrls.push({ path, url: urlData.publicUrl })
  }

  const expectedValue = VALUE_RANGE_MAP[data.value_range] ?? null

  const { data: inserted, error } = await db.from('sourcing_leads').insert({
    seller_name: data.seller_name,
    seller_email: data.seller_email,
    seller_phone: data.seller_phone,
    seller_city: data.seller_city,
    artist_claimed: data.artist_claimed || null,
    technique_claimed: data.technique_claimed,
    dimensions_claimed: data.dimensions_claimed || null,
    acquisition_history: data.acquisition_history,
    expected_value_brl: expectedValue,
    has_documents: photoUrls.length > 0,
    photos: photoUrls,
    notes_internal: `Faixa expectativa: ${data.value_range}`,
    consent_data: true,
    consent_at: new Date().toISOString(),
    status: 'aguardando_analise',
  }).select('id').single()

  if (error || !inserted) {
    console.error('[submitSourcingLead]', error?.message)
    return { ok: false, error: 'Erro ao enviar solicitação. Tente novamente ou entre em contato pelo WhatsApp.' }
  }

  const { notifySourcingLeadCreated } = await import('../../lib/notifications/sourcing-lead')
  notifySourcingLeadCreated(inserted.id).catch((err) => {
    console.error('[submitSourcingLead] notification failed', err)
  })

  return { ok: true }
}
