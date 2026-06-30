import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt-BR', 'en-US', 'fr-FR'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed', // /pt-BR omitido, /en-US e /fr-FR explícitos
  // ADR 004: site público PT-only — não negociar Accept-Language do navegador
  localeDetection: false,
})
