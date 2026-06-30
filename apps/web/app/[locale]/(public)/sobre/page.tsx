import type { Metadata } from 'next'
import { JsonLd } from '../../../../components/seo/JsonLd'
import { SobreDirectors } from '../../../../components/sobre/SobreDirectors'
import { SobreEditorialSections } from '../../../../components/sobre/SobreEditorialSections'
import { SobreGallerySection } from '../../../../components/sobre/SobreGallerySection'
import { SobreManifestoHero } from '../../../../components/sobre/SobreManifestoHero'
import { SobrePillarCards } from '../../../../components/sobre/SobrePillarCards'
import { SobreTimeline } from '../../../../components/sobre/SobreTimeline'
import { SobreVisitCta } from '../../../../components/sobre/SobreVisitCta'
import { buildInstitutionalMetadata } from '../../../../lib/pages/institutional'
import { breadcrumbSchema } from '../../../../lib/seo/schema'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildInstitutionalMetadata('sobre')
}

export default function SobrePage() {
  const schema = breadcrumbSchema([
    { name: 'Sobre', path: '/sobre' },
  ])

  return (
    <>
      <JsonLd data={schema} />
      <SobreManifestoHero />
      <SobrePillarCards />
      <SobreEditorialSections />
      <SobreDirectors />
      <SobreGallerySection />
      <SobreTimeline />
      <SobreVisitCta />
    </>
  )
}
