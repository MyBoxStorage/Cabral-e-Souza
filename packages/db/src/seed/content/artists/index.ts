export const ARTIST_HERO_IMAGES: Record<string, string> = {
  'di-cavalcanti':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Di_Cavalcanti_1922.jpg/800px-Di_Cavalcanti_1922.jpg',
  'pedro-americo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pedro_Americo_1884.jpg/800px-Pedro_Americo_1884.jpg',
  djanira:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Djanira_Motta_e_Silva.jpg/800px-Djanira_Motta_e_Silva.jpg',
  'alfredo-volpi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Alfredo_Volpi_%281957%29.jpg/800px-Alfredo_Volpi_%281957%29.jpg',
  'sergio-camargo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Sergio_Camargo_1970.jpg/800px-Sergio_Camargo_1970.jpg',
}

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
