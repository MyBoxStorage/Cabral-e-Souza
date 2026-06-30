import { CookieBanner } from '../../../components/layout/CookieBanner'
import { Footer } from '../../../components/layout/Footer'
import { Header } from '../../../components/layout/Header'
import { JsonLd } from '../../../components/seo/JsonLd'
import { localBusinessSchema } from '../../../lib/seo/schema'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
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
      {/* padding-top compensa o header fixo (h-16 mobile / h-[72px] desktop) */}
      <main id="main-content" className="pt-16 md:pt-[72px]">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
