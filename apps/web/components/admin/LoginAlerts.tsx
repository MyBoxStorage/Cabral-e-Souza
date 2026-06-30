'use client'

import { useSearchParams } from 'next/navigation'

const ERROR_MESSAGES: Record<string, string | ((params: URLSearchParams) => string)> = {
  unauthorized: 'Email não autorizado. Acesso restrito a administradores.',
  invalid_credentials: 'Email ou senha incorretos.',
  rate_limit: (params) => {
    const minutes = params.get('minutes') ?? '15'
    return `Muitas tentativas. Aguarde ${minutes} minuto(s) e tente novamente.`
  },
}

export function LoginAlerts() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (!error) return null

  const config = ERROR_MESSAGES[error]
  const message =
    typeof config === 'function'
      ? config(searchParams)
      : config ?? 'Não foi possível entrar. Tente novamente.'

  return (
    <div className="border border-[--color-danger]/30 bg-[--color-danger]/10 p-4 mb-6 text-center">
      <p className="font-body text-[12px] text-[rgba(250,250,247,0.7)]">{message}</p>
    </div>
  )
}
