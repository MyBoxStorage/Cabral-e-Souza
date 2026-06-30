import { cookies } from 'next/headers'
import { CookieBanner } from '../../../components/layout/CookieBanner'
import { Footer } from '../../../components/layout/Footer'
import { Header } from '../../../components/layout/Header'
import { JsonLd } from '../../../components/seo/JsonLd'
import { CONSENT_COOKIE_NAME, parseConsentCookie } from '../../../lib/cookie-consent'
import { localBusinessSchema } from '../../../lib/seo/schema'

export const dynamic = 'force-dynamic'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const cookieStore = await cookies()
  const consent = parseConsentCookie(cookieStore.get(CONSENT_COOKIE_NAME)?.value)
  const showCookieBanner = !consent?.decided

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[--color-ink] focus:text-[--color-paper] focus:px-4 focus:py-2 font-body text-[12px]"
      >
        Ir para o conteúdo
      </a>
      <JsonLd data={localBusinessSchema()} />
      <Header />
      <main id="main-content" className="pt-16 md:pt-[72px]">
        {children}
      </main>
      <Footer />
      {showCookieBanner && (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: '@media (max-width:767px){body{padding-bottom:22rem}}',
            }}
          />
          <CookieBanner />
        </>
      )}
    </>
  )
}
