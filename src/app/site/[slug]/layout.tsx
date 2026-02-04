import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function SiteLayout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
}
