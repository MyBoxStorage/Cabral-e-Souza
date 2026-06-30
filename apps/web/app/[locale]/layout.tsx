import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import { isNonPrimaryLocale } from '../../lib/seo/metadata'
import '../../styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: {
      template: '%s | Cabral & Souza',
      default: 'Cabral & Souza — Galeria de Arte e Antiguidades',
    },
    ...(isNonPrimaryLocale(locale) ? { robots: { index: false, follow: false } } : {}),
  }
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
      className={`${cormorant.variable} ${cormorant.className} ${inter.variable} ${inter.className}`}
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
