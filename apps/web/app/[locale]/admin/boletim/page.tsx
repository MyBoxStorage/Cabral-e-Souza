import Link from 'next/link'
import { createAdminClient } from '@cabral-souza/db'

export const metadata = { title: 'Boletim' }

async function getBoletimPosts() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('boletim_posts')
    .select('id, title_pt, slug, is_published, published_at, created_at')
    .order('created_at', { ascending: false })

  return data ?? []
}

export default async function AdminBoletimPage() {
  const posts = await getBoletimPosts()

  return (
    <div className="max-w-[800px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
          Boletim <span className="text-[--color-ink-subtle] text-[1.25rem]">({posts.length})</span>
        </h1>
        <Link
          href="/admin/boletim/novo"
          className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-5 py-2.5 transition-colors"
        >
          + Nova publicação
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-[--color-border] p-16 text-center">
          <p className="font-body text-[13px] text-[--color-ink-subtle] mb-4">
            Nenhuma publicação ainda.
          </p>
          <Link
            href="/admin/boletim/novo"
            className="font-body text-[12px] uppercase tracking-[0.1em] text-[--color-accent] underline underline-offset-4"
          >
            Criar primeira publicação
          </Link>
        </div>
      ) : (
        <div className="border border-[--color-border] divide-y divide-[--color-border]">
          {posts.map((post) => {
            return (
              <div
                key={post.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-[--color-surface] transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-body text-[13px] text-[--color-ink] truncate">{post.title_pt}</p>
                  <p className="font-body text-[11px] text-[--color-ink-subtle]">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                      : 'Não publicado'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className={`font-body text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 ${post.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {post.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                  <Link
                    href={`/admin/boletim/${post.id}`}
                    className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-accent] hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
