import { z } from 'zod'

export const PieceStatusEnum = z.enum([
  'rascunho',
  'privado',
  'publico',
  'reservado',
  'vendido',
  'arquivado',
])

export const PieceCategoryEnum = z.enum([
  'pintura',
  'escultura',
  'desenho',
  'gravura',
  'fotografia',
  'objeto',
  'antiguidade',
])

export const PieceOriginEnum = z.enum(['propria', 'consignada', 'parceria'])

export const AttributionRoleEnum = z.enum([
  'autoria_confirmada',
  'atribuida',
  'circulo_de',
  'escola_de',
  'apocrifa',
])

export const PriceVisibilityEnum = z.enum(['publico', 'sob_consulta', 'oculto'])

/** Preço público exposto só abaixo de R$ 20.000 */
export const PRICE_PUBLIC_THRESHOLD_BRL = 20_000
