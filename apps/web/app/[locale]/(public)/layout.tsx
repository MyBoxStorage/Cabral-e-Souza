import { CookieBanner } from '../../../components/layout/CookieBanner'
import { Footer } from '../../../components/layout/Footer'
import { Header } from '../../../components/layout/Header'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
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
