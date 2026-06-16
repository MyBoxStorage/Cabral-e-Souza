import Link from 'next/link'
import { BoletimForm } from '../../../../../components/admin/BoletimForm'

export const metadata = { title: 'Nova Publicação' }

export default function NovaPublicacaoPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/boletim"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] hover:text-[--color-ink] transition-colors"
        >
          ← Boletim
        </Link>
        <span className="text-[--color-border]">/</span>
        <h1 className="font-display text-[1.5rem] font-light text-[--color-ink]">
          Nova publicação
        </h1>
      </div>

      <BoletimForm />
    </div>
  )
}
