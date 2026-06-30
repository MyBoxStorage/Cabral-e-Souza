import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt-BR', 'en-US', 'fr-FR'],
  defaultLocale: 'pt-BR',
  localePrefix: 'always', // / redireciona para /pt-BR (ADR 004)
  // ADR 004: site público PT-only — não negociar Accept-Language do navegador
  localeDetection: false,
})
