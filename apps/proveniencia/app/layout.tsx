import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agente de Proveniência | Cabral & Souza',
  robots: { index: false, follow: false }, // nunca indexado
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
