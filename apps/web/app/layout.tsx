import type { Metadata } from 'next'
import { BUSINESS, SITE_URL_DEFAULT } from '@cabral-souza/shared'

export const metadata: Metadata = {
  title: {
    template: '%s | Cabral & Souza',
    default: 'Cabral & Souza — Galeria de Arte e Antiguidades',
  },
  description:
    'Galeria especializada em arte moderna e contemporânea brasileira. Rio de Janeiro, desde 1987.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? SITE_URL_DEFAULT),
  openGraph: {
    siteName: BUSINESS.name,
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
