'use client'

import Link from 'next/link'
import { IconHome } from '@tabler/icons-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="border-b border-slate-200/40 bg-slate-50/50 py-3 dark:border-slate-700/40 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link 
            href="/" 
            className="flex items-center gap-1 text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
          >
            <IconHome className="h-4 w-4" />
            Início
          </Link>
          
          {items.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className="text-slate-300 dark:text-slate-600">/</span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-900 dark:text-white">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}
