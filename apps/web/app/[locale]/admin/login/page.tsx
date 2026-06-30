import { Suspense } from 'react'
import { AdminLoginForm } from '../../../../components/admin/AdminLoginForm'
import { LoginAlerts } from '../../../../components/admin/LoginAlerts'

export const metadata = { title: 'Login' }

export default function AdminLoginPage() {
  return (
    <div className="admin-login-shell min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-12">
          <p className="font-display text-[1.375rem] text-[--color-paper] tracking-[-0.01em]">
            Cabral &amp; Souza
          </p>
          <p className="font-body text-[10px] uppercase tracking-[0.18em] text-[--color-accent] mt-1">
            Área administrativa
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginAlerts />
        </Suspense>

        <Suspense fallback={
          <div className="h-48 animate-pulse bg-[rgba(250,250,247,0.04)]" aria-hidden />
        }>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
