'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconShieldCheck,
  IconBuildingStore,
  IconLayoutDashboard,
  IconUsers,
  IconMenu2,
  IconCategory,
  IconLink,
} from '@tabler/icons-react'
import { useState } from 'react'
import { LogoutButton } from '@/components/auth/logout-button'
import { Logo } from '@/components/shared/logo'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface AdminHeaderProps {
  userName: string
}

const MOBILE_NAV = [
  { href: '/admin', label: 'Dashboard', icon: IconLayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: IconUsers },
  { href: '/admin/lojas', label: 'Lojas', icon: IconBuildingStore },
  { href: '/admin/categorias', label: 'Categorias', icon: IconCategory },
  { href: '/admin/vendas', label: 'Vendas', icon: IconLink },
]

export function AdminHeader({ userName }: AdminHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            >
              <IconMenu2 className="h-5 w-5" />
            </button>
            <Logo size="sm" href="/admin" />
            <Badge className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
              <IconShieldCheck className="h-3.5 w-3.5" />
              Admin
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">
              {userName}
            </span>
            <EnhancedButton
              asChild
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Link href="/painel">
                <IconBuildingStore className="h-4 w-4" />
                <span className="hidden sm:inline">Meus Sites</span>
              </Link>
            </EnhancedButton>
            <LogoutButton />
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <nav className="absolute left-0 top-16 w-64 border-r border-slate-200/60 bg-white p-4 shadow-xl dark:border-slate-700/60 dark:bg-slate-900">
            <div className="space-y-1">
              {MOBILE_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
