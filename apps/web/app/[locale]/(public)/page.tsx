import type { Metadata } from 'next'
import { SectionHeader, StatsBar } from '@cabral-souza/ui'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { BUSINESS } from '@cabral-souza/shared'
import { getLocale } from 'next-intl/server'
import { ArtistCard } from '../../../components/artwork/ArtistCard'
import { PieceArtworkCard } from '../../../components/artwork/PieceArtworkCard'
import { BoletimCard } from '../../../components/content/BoletimCard'
import { HomeAboutSection } from '../../../components/content/HomeAboutSection'
import { VenderObraCta } from '../../../components/content/VenderObraCta'
import { HomeHero } from '../../../components/home/HomeHero'
import { Reveal } from '../../../components/ui/Reveal'
import { formatBRL, formatDimensions, formatYear, getLocalizedTitle } from '../../../lib/format'
import { buildPageMetadata } from '../../../lib/seo/metadata'
import { getPublishedArtists } from '../../../lib/queries/artists'
import { getPublishedBoletimPosts } from '../../../lib/queries/boletim'
import { getDisplayPrice, getFeaturedPieces } from '../../../lib/queries/pieces'

export const revalidate = 3600

export const metadata: Metadata = buildPageMetadata({
  title: 'Galeria de Arte e Antiguidades',
  description:
    'Galeria editorial em Copacabana. Obras de Di Cavalcanti, Alfredo Volpi, Djanira e outros mestres. Rio de Janeiro, desde 1987.',
  path: '/',
})

function getPrimaryImage(piece: Awaited<ReturnType<typeof getFeaturedPieces>>[number]) {
  return piece.piece_images
    .slice()
    .sort((a, b) =>
      a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1,
    )[0]
}

export default async function HomePage() {
  const locale = await getLocale()
  const yearsOfTradition = new Date().getFullYear() - BUSINESS.foundedYear

  const [featuredPieces, artists, boletimPosts] = await Promise.all([
    getFeaturedPieces(4),
    getPublishedArtists(),
    getPublishedBoletimPosts(2),
  ])

  const heroPiece = featuredPieces[0]
  const heroImage = heroPiece ? getPrimaryImage(heroPiece) : null

  const heroTitle = heroPiece ? getLocalizedTitle(heroPiece, locale) : 'Obra em destaque'
  const heroTechnical = heroPiece
    ? [
        heroPiece.artists?.name,
        heroPiece.technique_pt,
        formatYear(heroPiece.year_created, heroPiece.year_created_circa),
        formatDimensions(heroPiece.height_cm, heroPiece.width_cm),
      ]
        .filter(Boolean)
        .join(' · ')
    : ''
  const heroPrice = heroPiece
    ? (() => {
        const price = getDisplayPrice(heroPiece)
        return price !== null ? formatBRL(price) : 'Sob consulta'
      })()
    : 'Sob consulta'

  const displayArtists = artists.slice(0, 5)

  return (
    <>
      <HomeHero
        imageUrl={heroImage?.url_large ?? heroImage?.url_original ?? null}
        imageAlt={heroImage?.alt_text_pt ?? heroTitle}
        artworkTitle={heroTitle}
        artworkTechnical={heroTechnical}
        priceLabel={heroPrice}
      />

      <StatsBar
        items={[
          { value: '+500', label: 'Peças em Acervo' },
          { value: String(yearsOfTradition), label: 'Anos de Tradição' },
          { value: '100%', label: 'Autenticidade Garantida' },
        ]}
      />

      {featuredPieces.length > 0 && (
        <Reveal>
          <section aria-labelledby="featured-heading" className="section-padding bg-cream-100">
            <div className="container-default">
              <SectionHeader
                eyebrow="Acervo"
                title="Destaques do Acervo"
                link={{ href: '/acervo', label: 'Ver acervo completo' }}
                className="mb-12"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredPieces.map((piece, i) => (
                  <Reveal key={piece.id} delay={i * 80}>
                    <PieceArtworkCard piece={piece} priority={i < 2} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {displayArtists.length > 0 && (
        <Reveal>
          <section aria-labelledby="artists-heading" className="section-padding bg-cream-100">
            <div className="container-default">
              <SectionHeader eyebrow="Artistas" title="Artistas do acervo" className="mb-12" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                {displayArtists.map((artist, i) => (
                  <Reveal key={artist.id} delay={i * 80}>
                    <ArtistCard artist={artist} priority={i < 2} />
                  </Reveal>
                ))}
              </div>
              <div className="mt-12 text-center">
                <ButtonLink href="/artistas" variant="tertiary" showChevron>
                  Ver todos os artistas
                </ButtonLink>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {boletimPosts.length > 0 && (
        <Reveal>
          <section aria-labelledby="boletim-heading" className="section-padding bg-cream-100">
            <div className="container-default">
              <SectionHeader eyebrow="Boletim" title="Análises e mercado" className="mb-12" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {boletimPosts.map((post, i) => (
                  <Reveal key={post.id} delay={i * 80}>
                    <BoletimCard post={post} />
                  </Reveal>
                ))}
              </div>
              <div className="mt-12 text-center">
                <ButtonLink href="/boletim" variant="tertiary" showChevron>
                  Ver boletim completo
                </ButtonLink>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <HomeAboutSection />
      </Reveal>

      <Reveal delay={60}>
        <VenderObraCta />
      </Reveal>
    </>
  )
}
