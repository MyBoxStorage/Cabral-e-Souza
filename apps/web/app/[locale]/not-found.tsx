import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="label-caps mb-6">404</p>
      <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-light tracking-[-0.02em] text-[--color-ink] mb-4">
        Página não encontrada
      </h1>
      <p className="font-body text-[15px] leading-[1.8] text-[--color-ink-muted] max-w-[44ch] mb-10">
        A obra, artista ou página que você procura não está disponível — pode ter sido movida ou retirada do acervo público.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-accent] px-8 py-4 transition-colors duration-200"
        >
          Página inicial
        </Link>
        <Link
          href="/acervo"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] border-b border-[--color-accent] pb-[2px] hover:text-[--color-ink] hover:border-[--color-ink] transition-colors"
        >
          Explorar acervo
        </Link>
      </div>
    </div>
  )
}
