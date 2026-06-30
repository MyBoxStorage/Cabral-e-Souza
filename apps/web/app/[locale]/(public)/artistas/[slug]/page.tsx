import type { Metadata } from 'next'
import { FrameOrnamental, SectionHeader } from '@cabral-souza/ui'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArtistVerbeteTabs } from '../../../../../components/artwork/ArtistVerbeteTabs'
import { PieceArtworkCard } from '../../../../../components/artwork/PieceArtworkCard'
import { JsonLd } from '../../../../../components/seo/JsonLd'
import { splitArtistBio } from '../../../../../lib/artists'
import { artistYears } from '../../../../../lib/format'
import {
  getArtistAuctionComparables,
  getArtistBySlug,
  getArtistSlugs,
} from '../../../../../lib/queries/artists'
import { countPublicPieces, getPublicPieces } from '../../../../../lib/queries/pieces'
import { buildPageMetadata } from '../../../../../lib/seo/metadata'
import { breadcrumbSchema, personSchema } from '../../../../../lib/seo/schema'

export const revalidate = 3600

interface ArtistPageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const slugs = await getArtistSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)
  if (!artist) return { title: 'Artista não encontrado' }

  const years = artistYears(artist.birth_year, artist.death_year)
  return buildPageMetadata({
    title: `${artist.name}${years ? ` ${years}` : ''}`,
    description:
      artist.bio_pt?.slice(0, 160).replace(/#+\s*/g, '') ??
      `Obras e verbete de ${artist.name} na Cabral & Souza Galeria de Arte.`,
    path: `/artistas/${slug}`,
    ...(artist.hero_image_url ? { ogImage: artist.hero_image_url } : {}),
    ogType: 'profile',
  })
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const artist = await getArtistBySlug(slug)
  if (!artist) notFound()

  const [pieces, totalPieces, comparables] = await Promise.all([
    getPublicPieces({ artistSlug: slug, limit: 8 }),
    countPublicPieces({ artistSlug: slug }),
    getArtistAuctionComparables(artist.id),
  ])

  const bio =
    locale === 'en-US'
      ? (artist.bio_en ?? artist.bio_pt)
      : locale === 'fr-FR'
        ? (artist.bio_fr ?? artist.bio_pt)
        : artist.bio_pt

  const { biografia, mercado } = bio ? splitArtistBio(bio) : { biografia: '', mercado: '' }
  const years = artistYears(artist.birth_year, artist.death_year)

  const schema = [
    breadcrumbSchema([
      { name: 'Artistas', path: '/artistas' },
      { name: artist.name, path: `/artistas/${artist.slug}` },
    ]),
    personSchema({
      slug: artist.slug,
      name: artist.name,
      bio,
      image: artist.hero_image_url,
      birthYear: artist.birth_year,
      deathYear: artist.death_year,
      birthPlace: artist.birth_place,
      nationality: artist.nationality,
      schools: artist.schools,
    }),
  ]

  return (
    <>
      <JsonLd data={schema} />

      {/* Hero 50/50 */}
      <section className="bg-cream-100 border-b border-cream-200">
        <div className="container-default py-12 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 list-none font-body text-body-sm text-ink-700">
              <li>
                <Link href="/artistas" className="hover:text-bronze-500 transition-colors duration-base">
                  Artistas
                </Link>
              </li>
              <li aria-hidden className="text-ink-700/40">
                /
              </li>
              <li aria-current="page" className="text-ink-800">
                {artist.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              {artist.nationality && (
                <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
                  {artist.nationality}
                </p>
              )}

              <h1 className="font-display font-normal text-title-lg text-ink-800 leading-tight mb-4">
                {artist.name}
              </h1>

              {years && <p className="font-body text-lead text-ink-700 mb-6">{years}</p>}

              {artist.schools && artist.schools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {artist.schools.map((school) => (
                    <span
                      key={school}
                      className="font-body text-eyebrow uppercase tracking-caps text-ink-700 border border-cream-200 px-3 py-1"
                    >
                      {school}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {artist.hero_image_url && (
              <div className="flex justify-center lg:justify-end">
                <FrameOrnamental className="w-full max-w-[320px]">
                  <div className="relative aspect-[3/4] bg-cream-200">
                    <Image
                      src={artist.hero_image_url}
                      alt={`${artist.name} — retrato`}
                      fill
                      sizes="(max-width: 1024px) 80vw, 320px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </FrameOrnamental>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-default section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
          <div>
            {bio && (
              <ArtistVerbeteTabs
                biografia={biografia}
                mercado={mercado}
                comparables={comparables}
              />
            )}

            {pieces.length > 0 && (
              <section aria-label="Obras disponíveis" className="mb-16">
                <SectionHeader eyebrow="Acervo" title="Obras disponíveis" className="mb-10" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {pieces.map((piece, i) => (
                    <PieceArtworkCard key={piece.id} piece={piece} priority={i < 4} locale={locale} />
                  ))}
                </div>
                {totalPieces > pieces.length && (
                  <div className="mt-12 text-center">
                    <ButtonLink href={`/acervo?artista=${artist.slug}`} variant="secondary">
                      Ver todo o acervo de {artist.name}
                    </ButtonLink>
                  </div>
                )}
              </section>
            )}

            <section className="bg-ink-900 text-cream-100 p-10 lg:p-14 text-center">
              <p className="font-display text-title-xs font-normal mb-3">
                Interesse em obras de {artist.name}?
              </p>
              <p className="font-body text-body text-cream-300/80 mb-8 max-w-[48ch] mx-auto">
                Consulte nossa curadoria sobre disponibilidade, condições e dossiê de mercado.
              </p>
              <ButtonLink href="/contato" variant="primary">
                Solicitar dossiê
              </ButtonLink>
            </section>
          </div>

          <aside className="flex flex-col gap-8 lg:self-start lg:sticky lg:top-28">
            <div className="border border-cream-200 bg-cream-50 p-6">
              <h2 className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-5">
                Dados
              </h2>
              <dl className="flex flex-col gap-4">
                {[
                  {
                    label: 'Nascimento',
                    value: artist.birth_year
                      ? `${artist.birth_year}${artist.birth_place ? `, ${artist.birth_place}` : ''}`
                      : null,
                  },
                  { label: 'Falecimento', value: artist.death_year?.toString() },
                  { label: 'Nacionalidade', value: artist.nationality },
                ]
                  .filter((r) => r.value)
                  .map((row) => (
                    <div key={row.label}>
                      <dt className="font-body text-eyebrow uppercase tracking-caps text-ink-700">
                        {row.label}
                      </dt>
                      <dd className="font-body text-body-sm text-ink-800 mt-1">{row.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
