import type { Metadata } from 'next'
import { buildInstitutionalMetadata, InstitutionalPage } from '../../../../lib/pages/institutional'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildInstitutionalMetadata('como-funciona')
}

export default function ComoFuncionaPage() {
  return <InstitutionalPage slug="como-funciona" />
}
