import type { Metadata } from 'next'
import { ArtistCard } from '../../../../components/artwork/ArtistCard'
import { getPublishedArtists } from '../../../../lib/queries/artists'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Artistas',
  description:
    'Verbetes de artistas representados pela Cabral & Souza: Di Cavalcanti, Alfredo Volpi, Djanira, Sergio Camargo, Pedro Américo e outros mestres da arte brasileira.',
}

export default async function ArtistasPage() {
  const artists = await getPublishedArtists()

  return (
    <>
      {/* Cabeçalho */}
      <section className="bg-[--color-paper-muted] border-b border-[--color-paper-deep] py-12 md:py-16">
        <div className="container-default">
          <p className="label-caps text-[--color-accent] mb-4">Artistas</p>
          <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-light tracking-[-0.02em]">
            Artistas
          </h1>
          <p className="font-body text-[--color-ink-muted] mt-3 max-w-[56ch]">
            Verbetes curatoriais dos artistas em nosso acervo, com pesquisa de mercado
            e referências de leilão.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16">
        <div className="container-default">
          {artists.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-[1.5rem] font-light text-[--color-ink-subtle]">
                Verbetes em preparação
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {artists.map((artist, i) => (
                <ArtistCard key={artist.id} artist={artist} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
