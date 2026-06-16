import { z } from 'zod'

export const LeadSourceEnum = z.enum([
  'site_formulario',
  'whatsapp',
  'instagram',
  'google_meu_negocio',
  'indicacao',
  'newsletter',
  'viewing_room',
  'sourcing_form',
  'outro',
])

export const LeadStatusEnum = z.enum([
  'novo',
  'qualificado',
  'em_negociacao',
  'ganho',
  'perdido',
  'descartado',
])

export const BuyerProfileEnum = z.enum([
  'colecionador',
  'investidor',
  'decorador',
  'arquiteto',
  'curioso',
  'instituicao',
  'nao_informado',
])

export const CreateLeadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().optional(),
  phone: z.string().min(8).max(30).optional(),
  buyer_profile: BuyerProfileEnum.optional().default('nao_informado'),
  source: LeadSourceEnum,
  piece_id: z.string().uuid().optional(),
  viewing_room_id: z.string().uuid().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  consent_marketing: z.boolean().default(false),
})

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>
