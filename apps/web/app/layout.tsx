import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Cabral & Souza',
    default: 'Cabral & Souza — Galeria de Arte e Antiguidades',
  },
  description:
    'Galeria especializada em quadros a óleo, esculturas em bronze e arte clássica brasileira. Rio de Janeiro, desde 1987.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://cabralesouza.com.br'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
