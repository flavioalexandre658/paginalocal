'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconLayoutDashboard,
  IconUsers,
  IconBuildingStore,
  IconCategory,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: IconLayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: IconUsers },
  { href: '/admin/lojas', label: 'Lojas', icon: IconBuildingStore },
  { href: '/admin/categorias', label: 'Categorias', icon: IconCategory },
]

export function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/40 bg-white/50 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-900/50 lg:block">
      <nav className="sticky top-16 space-y-1 p-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
              isActive(item.href)
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
