import type { CookieOptions } from '@supabase/ssr'

/** Opções de cookie de sessão Supabase — httpOnly é definido pelo @supabase/ssr no servidor. */
export const supabaseCookieOptions: CookieOptions = {
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}
