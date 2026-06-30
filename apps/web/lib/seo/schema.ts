import { BUSINESS } from '@cabral-souza/shared'
import { getSiteUrl } from './metadata'

export interface BreadcrumbItem {
  name: string
  path: string
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}

export function localBusinessSchema() {
  const siteUrl = getSiteUrl()
  return stripUndefined({
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    '@id': `${siteUrl}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: 'Galeria especializada em arte moderna e contemporânea brasileira.',
    url: siteUrl,
    email: BUSINESS.email,
    telephone: `+${BUSINESS.phone.whatsappE164}`,
    foundingDate: BUSINESS.foundedYear.toString(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: 'BR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [BUSINESS.social.instagram],
  })
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}

interface VisualArtworkInput {
  slug: string
  title: string
  description?: string | null
  images: string[]
  technique?: string | null
  heightCm?: number | null
  widthCm?: number | null
  year?: string | null
  price?: number | null
  artist?: {
    name: string
    slug: string
    birthYear?: number | null
    deathYear?: number | null
    nationality?: string | null
  } | null
}

export function visualArtworkSchema(input: VisualArtworkInput) {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/acervo/${input.slug}`

  return stripUndefined({
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': url,
    url,
    name: input.title,
    description: input.description ?? undefined,
    inLanguage: 'pt-BR',
    image: input.images.length > 0 ? input.images : undefined,
    artMedium: input.technique ?? undefined,
    height: input.heightCm ? { '@type': 'QuantitativeValue', value: input.heightCm, unitCode: 'CMT' } : undefined,
    width: input.widthCm ? { '@type': 'QuantitativeValue', value: input.widthCm, unitCode: 'CMT' } : undefined,
    dateCreated: input.year ?? undefined,
    creator: input.artist
      ? stripUndefined({
          '@type': 'Person',
          name: input.artist.name,
          url: `${siteUrl}/artistas/${input.artist.slug}`,
          birthDate: input.artist.birthYear?.toString(),
          deathDate: input.artist.deathYear?.toString(),
          nationality: input.artist.nationality ?? undefined,
        })
      : undefined,
    offers:
      input.price !== null && input.price !== undefined
        ? {
            '@type': 'Offer',
            price: input.price,
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            seller: { '@id': `${siteUrl}/#organization` },
          }
        : undefined,
    provider: { '@id': `${siteUrl}/#organization` },
  })
}

interface PersonInput {
  slug: string
  name: string
  bio?: string | null
  image?: string | null
  birthYear?: number | null
  deathYear?: number | null
  birthPlace?: string | null
  nationality?: string | null
  schools?: string[] | null
}

export function personSchema(input: PersonInput) {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/artistas/${input.slug}`

  return stripUndefined({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': url,
    url,
    name: input.name,
    description: input.bio?.replace(/#+\s*/g, '').replace(/\*/g, '').slice(0, 300),
    image: input.image ?? undefined,
    birthDate: input.birthYear?.toString(),
    deathDate: input.deathYear?.toString(),
    birthPlace: input.birthPlace ?? undefined,
    nationality: input.nationality ?? undefined,
    knowsAbout: input.schools?.length ? input.schools : undefined,
    worksFor: { '@id': `${siteUrl}/#organization` },
    sameAs: [BUSINESS.social.instagram],
  })
}

interface ArticleInput {
  slug: string
  title: string
  description?: string | null
  publishedAt?: string | null
  author?: string | null
}

export function articleSchema(input: ArticleInput) {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/boletim/${input.slug}`

  return stripUndefined({
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: input.title,
    description: input.description ?? undefined,
    datePublished: input.publishedAt ?? undefined,
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Organization',
      name: input.author ?? BUSINESS.name,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.name,
      url: siteUrl,
    },
    image: `${siteUrl}/opengraph-image`,
  })
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
