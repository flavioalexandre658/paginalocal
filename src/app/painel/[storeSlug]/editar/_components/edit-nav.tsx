'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconSettings,
  IconListDetails,
  IconFileText,
  IconSearch,
  IconShare,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface EditNavProps {
  storeSlug: string
}

const NAV_ITEMS = [
  { href: 'geral', label: 'Geral', icon: IconSettings },
  { href: 'sessoes', label: 'Seções', icon: IconListDetails },
  { href: 'paginas', label: 'Páginas', icon: IconFileText },
  { href: 'seo', label: 'SEO', icon: IconSearch },
  { href: 'redes-sociais', label: 'Redes Sociais', icon: IconShare },
]

export function EditNav({ storeSlug }: EditNavProps) {
  const pathname = usePathname()
  const basePath = `/painel/${storeSlug}/editar`

  return (
    <nav className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
        {NAV_ITEMS.map((item) => {
          const fullHref = `${basePath}/${item.href}`
          const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`)

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-all',
                isActive
                  ? 'border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'border-slate-200/60 bg-white/70 text-slate-600 backdrop-blur-sm hover:border-primary/20 hover:bg-white hover:text-slate-900 dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
