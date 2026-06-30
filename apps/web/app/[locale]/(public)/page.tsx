import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { ArtistCard } from '../../../components/artwork/ArtistCard'
import { PieceCard } from '../../../components/artwork/PieceCard'
import { BoletimCard } from '../../../components/content/BoletimCard'
import { VenderObraCta } from '../../../components/content/VenderObraCta'
import { Reveal } from '../../../components/ui/Reveal'
import { buildPageMetadata } from '../../../lib/seo/metadata'
import { getPublishedArtists } from '../../../lib/queries/artists'
import { getPublishedBoletimPosts } from '../../../lib/queries/boletim'
import { getFeaturedPieces } from '../../../lib/queries/pieces'

export const revalidate = 3600

export const metadata: Metadata = buildPageMetadata({
  title: 'Galeria de Arte e Antiguidades',
  description:
    'Galeria especializada em arte moderna e contemporânea brasileira. Obras de Di Cavalcanti, Alfredo Volpi, Djanira e outros mestres. Rio de Janeiro, desde 1987.',
  path: '/',
})

export default async function HomePage() {
  const locale = await getLocale()
  const [featuredPieces, artists, boletimPosts] = await Promise.all([
    getFeaturedPieces(3),
    getPublishedArtists(),
    getPublishedBoletimPosts(2),
  ])

  const heroPiece = featuredPieces[0]
  const heroImage = heroPiece?.piece_images
    ?.slice()
    .sort((a, b) => (a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1))[0]

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative min-h-[calc(100dvh-72px)] bg-[--color-ink] text-[--color-paper] overflow-hidden"
      >
        <div className="container-default grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100dvh-72px)] items-center">
          <div className="relative z-10 flex flex-col justify-center py-16 lg:py-24 text-center lg:text-left min-h-[26rem] sm:min-h-[28rem] lg:min-h-[32rem] order-2 lg:order-1">
            <p className="label-caps text-[--color-accent] mb-8">Galeria de Arte · Rio de Janeiro · Desde 1987</p>

            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.75rem,7vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] max-w-[14ch] mx-auto lg:mx-0 mb-8"
            >
              Arte brasileira com rigor curatorial
            </h1>

            <p className="font-body text-[--text-lg] leading-[1.8] text-[rgba(250,250,247,0.75)] max-w-[44ch] mx-auto lg:mx-0 mb-12">
              Modernismo, arte contemporânea e antiguidades selecionadas. Autenticidade documentada, proveniência verificada.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5">
              <Link
                href="/acervo"
                className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-8 py-4 transition-colors duration-200"
              >
                Explorar acervo
              </Link>
              <Link
                href="/contato"
                className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] border-b border-[--color-accent] pb-[2px] hover:text-[--color-paper] hover:border-[--color-paper] transition-colors duration-200"
              >
                Falar com a galeria
              </Link>
            </div>
          </div>

          {heroImage && (
            <div className="relative min-h-[45vh] lg:min-h-[calc(100dvh-72px)] lg:-mr-[var(--space-16)] order-1 lg:order-2">
              <Image
                src={heroImage.url_large ?? heroImage.url_original}
                alt={heroImage.alt_text_pt ?? heroPiece?.title_pt ?? 'Obra em destaque'}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[--color-ink]/80 via-[--color-ink]/25 to-transparent lg:from-[--color-ink] lg:via-[--color-ink]/40"
                aria-hidden
              />
            </div>
          )}
        </div>

        <p
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:left-8 font-body text-[10px] uppercase tracking-[0.18em] text-[rgba(139,115,85,0.4)]"
        >
          Est. 1987
        </p>
      </section>

      {/* Strip de credenciais */}
      <Reveal>
      <section aria-label="Diferenciais" className="bg-[--color-paper-muted] border-y border-[--color-paper-deep] py-10">
        <div className="container-default">
          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[--color-paper-deep]">
            {[
              { value: '40', label: 'Anos de atuação' },
              { value: '100%', label: 'Autenticidade documentada' },
              { value: 'RJ', label: 'Sede no Rio de Janeiro' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-6 px-8 text-center">
                <dt className="font-display text-[2.5rem] font-light text-[--color-ink] leading-none mb-2">
                  {stat.value}
                </dt>
                <dd className="font-body text-[11px] uppercase tracking-[0.12em] text-[--color-ink-subtle]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      </Reveal>

      {/* Destaques do acervo */}
      {featuredPieces.length > 0 && (
        <Reveal>
        <section aria-labelledby="featured-heading" className="py-16 md:py-24">
          <div className="container-default">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div>
                <p className="label-caps mb-3">Acervo</p>
                <h2 id="featured-heading" className="font-display text-[2rem] md:text-[2.5rem] font-light tracking-[-0.02em]">
                  Destaques do Acervo
                </h2>
              </div>
              <Link
                href="/acervo"
                className="hidden sm:inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:text-[--color-accent-deep] transition-colors shrink-0"
              >
                Ver acervo completo →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
              {featuredPieces.map((piece, i) => (
                <PieceCard key={piece.id} piece={piece} priority={i < 2} locale={locale} />
              ))}
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* Artistas */}
      {artists.length > 0 && (
        <Reveal delay={80}>
        <section aria-labelledby="artists-heading" className="bg-[--color-paper-muted] border-y border-[--color-paper-deep] py-16 md:py-24">
          <div className="container-default">
            <div className="mb-10">
              <p className="label-caps mb-3">Artistas</p>
              <h2 id="artists-heading" className="font-display text-[2rem] md:text-[2.5rem] font-light tracking-[-0.02em]">
                Artistas do acervo
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
              {artists.map((artist, i) => (
                <ArtistCard key={artist.id} artist={artist} priority={i < 2} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/artistas"
                className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-paper] px-8 py-4 transition-colors duration-200"
              >
                Ver todos os artistas
              </Link>
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* Boletim */}
      {boletimPosts.length > 0 && (
        <Reveal delay={80}>
        <section aria-labelledby="boletim-heading" className="py-16 md:py-24">
          <div className="container-default">
            <div className="mb-10">
              <p className="label-caps mb-3">Boletim</p>
              <h2 id="boletim-heading" className="font-display text-[2rem] md:text-[2.5rem] font-light tracking-[-0.02em]">
                Análises e mercado
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boletimPosts.map((post) => (
                <BoletimCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/boletim"
                className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:text-[--color-accent-deep] transition-colors"
              >
                Ver boletim completo →
              </Link>
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* Institucional curto */}
      <Reveal>
      <section className="bg-[--color-ink] text-[--color-paper] py-16 md:py-20">
        <div className="container-default max-w-[56ch] text-center mx-auto">
          <p className="font-body text-[15px] leading-[1.85] text-[rgba(250,250,247,0.75)] mb-8">
            Fundada em 1987 no Rio de Janeiro, a Cabral &amp; Souza dedica-se à curadoria rigorosa de arte moderna e
            contemporânea brasileira — com integridade documental, transparência comercial e orientação ao colecionador.
          </p>
          <Link
            href="/sobre"
            className="inline-block font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] border-b border-[--color-accent] pb-[2px] hover:text-[--color-paper] hover:border-[--color-paper] transition-colors"
          >
            Conheça nossa história
          </Link>
        </div>
      </section>
      </Reveal>

      {/* CTA vender obra */}
      <Reveal delay={60}>
        <VenderObraCta />
      </Reveal>
    </>
  )
}
