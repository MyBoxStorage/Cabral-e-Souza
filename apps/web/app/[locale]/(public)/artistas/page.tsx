import type { Metadata } from 'next'
import { PageHeader } from '@cabral-souza/ui'
import { ArtistCard } from '../../../../components/artwork/ArtistCard'
import { Reveal } from '../../../../components/ui/Reveal'
import { getPublishedArtists } from '../../../../lib/queries/artists'
import { buildPageMetadata } from '../../../../lib/seo/metadata'

export const revalidate = 3600

export const metadata: Metadata = buildPageMetadata({
  title: 'Artistas',
  description:
    'Verbetes de artistas representados pela Cabral & Souza: Di Cavalcanti, Alfredo Volpi, Djanira, Sergio Camargo, Pedro Américo e outros mestres da arte brasileira.',
  path: '/artistas',
})

export default async function ArtistasPage() {
  const artists = await getPublishedArtists()

  return (
    <>
      <PageHeader
        section="Artistas"
        title="Artistas"
        subtitle="Verbetes curatoriais dos artistas em nosso acervo, com pesquisa de mercado e referências de leilão."
      />

      <section className="section-padding bg-cream-50">
        <div className="container-default">
          {artists.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-title-sm font-normal text-ink-700/50">
                Verbetes em preparação
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {artists.map((artist, i) => (
                <Reveal key={artist.id} delay={Math.min(i * 60, 360)}>
                  <ArtistCard artist={artist} priority={i < 4} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
