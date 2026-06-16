import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é rota de admin (ex: /admin, /en-US/admin, /fr-FR/admin)
  const isAdminRoute = /^\/(?:pt-BR\/|en-US\/|fr-FR\/)?admin/.test(pathname)
  const isLoginRoute = /^\/(?:pt-BR\/|en-US\/|fr-FR\/)?admin\/login/.test(pathname)
  const isCallbackRoute = /^\/(?:pt-BR\/|en-US\/|fr-FR\/)?admin\/auth\/callback/.test(pathname)

  // Rotas de auth não precisam de guarda
  if (isLoginRoute || isCallbackRoute) {
    return intlMiddleware(request)
  }

  if (isAdminRoute) {
    // Verificar sessão Supabase via cookies
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Não autenticado — redirecionar para login preservando locale
      const locale = pathname.match(/^\/(pt-BR|en-US|fr-FR)\//)?.[1] ?? ''
      const loginPath = locale ? `/${locale}/admin/login` : '/admin/login'
      const loginUrl = new URL(loginPath, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar se é email autorizado
    const allowedEmails = (process.env['ADMIN_EMAILS'] ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())

    if (!allowedEmails.includes((user.email ?? '').toLowerCase())) {
      const loginUrl = new URL('/admin/login?error=unauthorized', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Aplicar i18n e retornar com cookies de sessão atualizados
    const intlResponse = intlMiddleware(request)
    response.headers.forEach((value, key) => intlResponse.headers.set(key, value))
    return intlResponse
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
