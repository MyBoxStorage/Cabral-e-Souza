import { redirect } from 'next/navigation'
import { AdminSidebar } from '../../../components/admin/AdminSidebar'
import { getAdminUser } from '../../../lib/supabase/server'

export const metadata = {
  title: { default: 'Admin', template: '%s · Admin — Cabral & Souza' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[--color-surface]">
      <AdminSidebar userEmail={user.email!} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
