'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  recordLoginAttempt,
} from '../../lib/auth/login-rate-limit'
import { isAllowedAdminEmail } from '../../lib/auth/admin-emails'
import { createSupabaseServerClient } from '../../lib/supabase/server'

// Reset de senha: manual pelo painel Supabase (Authentication → Users). Sem fluxo "esqueci minha senha" por enquanto.

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
  redirect: z.string().optional(),
})

function getClientIp(headerStore: Headers): string {
  return (
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerStore.get('x-real-ip') ??
    'unknown'
  )
}

function safeRedirectPath(path: string | undefined): string {
  if (!path || !path.startsWith('/admin') || path.startsWith('/admin/login')) {
    return '/admin'
  }
  return path
}

export async function adminLogin(formData: FormData): Promise<void> {
  const headerStore = await headers()
  const ip = getClientIp(headerStore)

  const rateCheck = checkLoginRateLimit(ip)
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs ?? 0) / 60_000)
    redirect(`/admin/login?error=rate_limit&minutes=${minutes}`)
  }

  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: formData.get('redirect') || undefined,
  })

  if (!parsed.success) {
    recordLoginAttempt(ip)
    redirect('/admin/login?error=invalid_credentials')
  }

  const { email, password, redirect: redirectTo } = parsed.data
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    recordLoginAttempt(ip)
    redirect('/admin/login?error=invalid_credentials')
  }

  if (!isAllowedAdminEmail(email)) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=unauthorized')
  }

  clearLoginAttempts(ip)
  redirect(safeRedirectPath(redirectTo))
}
