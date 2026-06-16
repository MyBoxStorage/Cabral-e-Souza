import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import '../../styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Cabral & Souza',
    default: 'Cabral & Souza — Galeria de Arte e Antiguidades',
  },
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
