/**
 * Imagens de domínio público baixadas do Wikimedia em 2026-06-30.
 * Substituir por fotos editoriais profissionais quando disponíveis.
 *
 * hero_image_url é definido em runtime pelo seed (artist-portraits.ts) apontando
 * para Supabase Storage — não usar URLs Wikimedia no front.
 */
export { ARTIST_PORTRAIT_SOURCES } from './portrait-sources'

export { DI_CAVALCANTI_BIO } from './di-cavalcanti'
export { PEDRO_AMERICO_BIO } from './pedro-americo'
export { DJANIRA_BIO } from './djanira'
export { ALFREDO_VOLPI_BIO } from './alfredo-volpi'
export { SERGIO_CAMARGO_BIO } from './sergio-camargo'

import { DI_CAVALCANTI_BIO } from './di-cavalcanti'
import { PEDRO_AMERICO_BIO } from './pedro-americo'
import { DJANIRA_BIO } from './djanira'
import { ALFREDO_VOLPI_BIO } from './alfredo-volpi'
import { SERGIO_CAMARGO_BIO } from './sergio-camargo'

export const EXPANDED_BIOS: Record<string, string> = {
  'di-cavalcanti': DI_CAVALCANTI_BIO,
  'pedro-americo': PEDRO_AMERICO_BIO,
  djanira: DJANIRA_BIO,
  'alfredo-volpi': ALFREDO_VOLPI_BIO,
  'sergio-camargo': SERGIO_CAMARGO_BIO,
}
