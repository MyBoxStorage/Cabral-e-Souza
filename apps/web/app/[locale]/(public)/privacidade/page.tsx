import type { Metadata } from 'next'
import { buildLegalMetadata, LegalPage } from '../../../../lib/pages/legal'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildLegalMetadata('privacidade')
}

export default function PrivacidadePage() {
  return <LegalPage slug="privacidade" />
}
