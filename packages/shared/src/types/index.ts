export type Locale = 'pt-BR' | 'en-US' | 'fr-FR'
export const LOCALES: Locale[] = ['pt-BR', 'en-US', 'fr-FR']
export const DEFAULT_LOCALE: Locale = 'pt-BR'

export type WithLocale<T> = T & { locale: Locale }

/** Campos multilíngues de peças e artistas */
export type TranslatableField = 'title' | 'description' | 'provenance' | 'bio' | 'technique'
