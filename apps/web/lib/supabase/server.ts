import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@cabral-souza/db'

/**
 * Cliente Supabase para Server Components / Server Actions / Route Handlers.
 * Lê/escreve cookies via next/headers — não pode ser usado em Client Components.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Em Server Components, set de cookie é no-op (apenas Server Actions / Route Handlers podem setar)
          }
        },
      },
    }
  )
}

/** Verifica se o usuário atual é admin (email autorizado). */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return null

  const allowedEmails = (process.env['ADMIN_EMAILS'] ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())

  if (!allowedEmails.includes(user.email.toLowerCase())) return null

  return user
}
