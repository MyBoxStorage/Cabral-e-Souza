import { z } from 'zod'

export const CreateViewingRoomSchema = z.object({
  client_name: z.string().min(2).max(120),
  client_email: z.string().email().optional(),
  message_pt: z.string().max(1000).optional(),
  expires_in_days: z.number().int().min(1).max(90).default(15),
  piece_ids: z.array(z.string().uuid()).min(1).max(40),
  notes_internal: z.string().max(500).optional(),
})

export type CreateViewingRoomInput = z.infer<typeof CreateViewingRoomSchema>

export const ViewingRoomEventTypeEnum = z.enum([
  'opened',
  'piece_viewed',
  'pdf_downloaded',
  'interest_clicked',
  'whatsapp_clicked',
  'shared',
])
