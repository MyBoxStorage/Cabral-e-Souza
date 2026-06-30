'use server'

import { createAdminClient } from '@cabral-souza/db'
import { revalidatePath } from 'next/cache'

const SOURCING_STATUSES = [
  'aguardando_analise',
  'em_pesquisa',
  'proposta_enviada',
  'aceita',
  'recusada',
  'inviavel',
  'arquivado',
] as const

export type SourcingLeadStatus = (typeof SOURCING_STATUSES)[number]

export async function updateSourcingLeadStatus(
  id: string,
  status: SourcingLeadStatus,
): Promise<void> {
  if (!SOURCING_STATUSES.includes(status)) throw new Error('Status inválido')

  const db = createAdminClient()
  const { error } = await db
    .from('sourcing_leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/sourcing')
}
