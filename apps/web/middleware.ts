import { createServerClient } from '@supabase/ssr'
import { BUSINESS } from '@cabral-souza/shared'
import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { isAllowedAdminEmail } from './lib/auth/admin-emails'
import { routing } from './i18n/routing'
import { supabaseCookieOptions } from './lib/supabase/cookie-options'

const intlMiddleware = createIntlMiddleware(routing)

const LOCALE_PREFIX = '(?:pt-BR|en-US|fr-FR)'
const ADMIN_PREFIX = `(?:\\/(?:${LOCALE_PREFIX}))?\\/admin`

/** Rota pública — apenas /admin/login (sem guarda de sessão) */
function isAdminLoginRoute(pathname: string): boolean {
  return new RegExp(`^${ADMIN_PREFIX}\\/login(?:\\/|$)`).test(pathname)
}

function isAdminRoute(pathname: string): boolean {
  return new RegExp(`^${ADMIN_PREFIX}(?:\\/|$)`).test(pathname)
}

function adminLoginPath(pathname: string): string {
  const locale = pathname.match(/^\/(pt-BR|en-US|fr-FR)\//)?.[1]
  return locale ? `/${locale}/admin/login` : '/admin/login'
}

function stripDisabledLocalePrefix(pathname: string): string | null {
  if (BUSINESS.i18nPublicEnabled) return null
  const match = pathname.match(/^\/(en-US|fr-FR)(\/.*)?$/)
  if (!match) return null
  return match[2] || '/'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const stripped = stripDisabledLocalePrefix(pathname)
  if (stripped !== null) {
    const url = request.nextUrl.clone()
    url.pathname = stripped
    return NextResponse.redirect(url)
  }

  // /admin/login nunca passa pela guarda
  if (isAdminLoginRoute(pathname)) {
    return intlMiddleware(request)
  }

  if (isAdminRoute(pathname)) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
      {
        cookieOptions: supabaseCookieOptions,
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
      const loginUrl = new URL(adminLoginPath(pathname), request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (!isAllowedAdminEmail(user.email ?? '')) {
      const loginUrl = new URL(`${adminLoginPath(pathname)}?error=unauthorized`, request.url)
      return NextResponse.redirect(loginUrl)
    }

    const intlResponse = intlMiddleware(request)
    response.headers.forEach((value, key) => intlResponse.headers.set(key, value))
    return intlResponse
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
