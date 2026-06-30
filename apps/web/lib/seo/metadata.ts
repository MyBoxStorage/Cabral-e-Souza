import type { Metadata } from 'next'
import { BUSINESS, SITE_URL_DEFAULT } from '@cabral-souza/shared'

export function getSiteUrl(): string {
  return process.env['NEXT_PUBLIC_SITE_URL'] ?? SITE_URL_DEFAULT
}

export interface PageMetadataOptions {
  title: string
  description?: string | undefined
  /** Path without locale prefix, e.g. `/acervo` or `/acervo/slug` */
  path?: string
  ogImage?: string | undefined
  noIndex?: boolean
  ogType?: 'website' | 'article' | 'profile'
}

export function buildPageMetadata(options: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl()
  const path = options.path ?? ''
  const canonical = `${siteUrl}${path}`
  const ogImage = options.ogImage ?? `${siteUrl}/opengraph-image`
  const description = options.description ?? undefined

  const metadata: Metadata = {
    title: options.title,
    description,
    alternates: {
      canonical,
      languages: {
        'pt-BR': canonical,
        'x-default': canonical,
      },
    },
    openGraph: {
      title: options.title,
      description,
      url: canonical,
      siteName: BUSINESS.name,
      locale: 'pt_BR',
      type: options.ogType ?? 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: BUSINESS.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description,
      images: [ogImage],
    },
  }

  if (options.noIndex) {
    metadata.robots = { index: false, follow: false }
  }

  return metadata
}

/** noindex para locales sem conteúdo traduzido (ADR 004) */
export function isNonPrimaryLocale(locale: string): boolean {
  return locale !== 'pt-BR'
}
