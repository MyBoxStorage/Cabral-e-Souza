import type { MetadataRoute } from 'next'
import { getSiteUrl } from '../lib/seo/metadata'
import { getArtistSlugs } from '../lib/queries/artists'
import { getBoletimSlugs } from '../lib/queries/boletim'
import { getPieceSlugs } from '../lib/queries/pieces'

const STATIC_PATHS = [
  '',
  '/acervo',
  '/artistas',
  '/boletim',
  '/sobre',
  '/servicos',
  '/como-funciona',
  '/contato',
  '/vender-obra',
  '/privacidade',
  '/termos',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const [pieceSlugs, artistSlugs, boletimSlugs] = await Promise.all([
    getPieceSlugs(),
    getArtistSlugs(),
    getBoletimSlugs(),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/acervo' ? 0.9 : 0.7,
  }))

  const pieceEntries: MetadataRoute.Sitemap = pieceSlugs.map((slug) => ({
    url: `${base}/acervo/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const artistEntries: MetadataRoute.Sitemap = artistSlugs.map((slug) => ({
    url: `${base}/artistas/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  const boletimEntries: MetadataRoute.Sitemap = boletimSlugs.map((slug) => ({
    url: `${base}/boletim/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...pieceEntries, ...artistEntries, ...boletimEntries]
}
