import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { AdminSidebar } from './_components/admin-sidebar'
import { AdminHeader } from './_components/admin-header'

interface LayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: LayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    redirect('/entrar')
  }

  const role = (session.user as { role?: string }).role
  if (role !== 'admin') {
    redirect('/painel')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <AdminHeader userName={session.user.name} />

      <div className="relative z-10 flex">
        <AdminSidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
