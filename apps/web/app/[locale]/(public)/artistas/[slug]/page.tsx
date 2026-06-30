import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PieceCard } from '../../../../../components/artwork/PieceCard'
import { MarkdownContent } from '../../../../../components/content/MarkdownContent'
import { JsonLd } from '../../../../../components/seo/JsonLd'
import { artistYears } from '../../../../../lib/format'
import { getArtistBySlug, getArtistSlugs } from '../../../../../lib/queries/artists'
import { getPublicPieces } from '../../../../../lib/queries/pieces'
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

  // Peças do artista em público
  const pieces = await getPublicPieces({ artistSlug: slug, limit: 8 })

  const bio =
    locale === 'en-US' ? (artist.bio_en ?? artist.bio_pt)
    : locale === 'fr-FR' ? (artist.bio_fr ?? artist.bio_pt)
    : artist.bio_pt

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

      {/* Hero do artista */}
      <section className="relative bg-[--color-ink] text-[--color-paper] overflow-hidden">
        <div className="container-default grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 py-16 md:py-24 items-end">
          <div>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 list-none font-body text-[12px] text-[rgba(250,250,247,0.4)]">
                <li>
                  <Link href="/artistas" className="hover:text-[--color-accent] transition-colors">
                    Artistas
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-[rgba(250,250,247,0.7)]">{artist.name}</li>
              </ol>
            </nav>

            {artist.nationality && (
              <p className="label-caps text-[--color-accent] mb-4">{artist.nationality}</p>
            )}

            <h1 className="font-display text-[2.5rem] md:text-[4rem] font-light leading-[1.05] tracking-[-0.025em] mb-4">
              {artist.name}
            </h1>

            {years && (
              <p className="font-body text-[1rem] text-[rgba(250,250,247,0.55)]">{years}</p>
            )}

            {artist.schools && artist.schools.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {artist.schools.map((school) => (
                  <span
                    key={school}
                    className="font-body text-[10px] uppercase tracking-[0.1em] text-[rgba(250,250,247,0.5)] border border-[rgba(250,250,247,0.15)] px-3 py-1"
                  >
                    {school}
                  </span>
                ))}
              </div>
            )}
          </div>

          {artist.hero_image_url && (
            <div className="relative w-[200px] h-[280px] md:w-[260px] md:h-[360px] flex-shrink-0 overflow-hidden">
              <Image
                src={artist.hero_image_url}
                alt={`${artist.name} — retrato`}
                fill
                sizes="260px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      <div className="container-default py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16">
          {/* Verbete */}
          <div>
            {bio && (
              <section aria-labelledby="bio-heading" className="mb-16">
                <h2 id="bio-heading" className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-6">
                  Verbete
                </h2>
                <MarkdownContent content={bio} />
              </section>
            )}

            {/* Peças disponíveis */}
            {pieces.length > 0 && (
              <section aria-labelledby="pieces-heading">
                <h2 id="pieces-heading" className="font-body text-[11px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-8">
                  Obras Disponíveis na Galeria
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
                  {pieces.map((piece, i) => (
                    <PieceCard key={piece.id} piece={piece} priority={i < 2} />
                  ))}
                </div>
                {pieces.length === 8 && (
                  <div className="mt-10 text-center">
                    <Link
                      href={`/acervo?artista=${artist.slug}`}
                      className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-paper] px-8 py-4 transition-colors duration-200"
                    >
                      Ver todo o acervo de {artist.name}
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-8 lg:self-start lg:sticky lg:top-24">
            {/* Dados do artista */}
            <div className="border border-[--color-paper-deep] p-6">
              <h2 className="font-body text-[10px] uppercase tracking-[0.14em] text-[--color-ink-subtle] mb-5">
                Dados
              </h2>
              <dl className="flex flex-col gap-3">
                {[
                  { label: 'Nascimento', value: artist.birth_year ? `${artist.birth_year}${artist.birth_place ? `, ${artist.birth_place}` : ''}` : null },
                  { label: 'Falecimento', value: artist.death_year?.toString() },
                  { label: 'Nacionalidade', value: artist.nationality },
                ].filter((r) => r.value).map((row) => (
                  <div key={row.label}>
                    <dt className="font-body text-[10px] uppercase tracking-[0.1em] text-[--color-ink-subtle]">{row.label}</dt>
                    <dd className="font-body text-[13px] text-[--color-ink] mt-0.5">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* CTA contato */}
            <div className="border border-[--color-paper-deep] p-6 text-center">
              <p className="font-display text-[1.0625rem] font-light text-[--color-ink] mb-2">
                Interesse em obras deste artista?
              </p>
              <p className="font-body text-[12px] text-[--color-ink-subtle] mb-5">
                Consulte nossa curadoria sobre disponibilidade e condições.
              </p>
              <Link
                href="/contato"
                className="inline-block w-full font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] py-3 transition-colors duration-200 text-center"
              >
                Consultar
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
