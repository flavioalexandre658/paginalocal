import { ReactNode } from 'react'
import { TrackingScripts } from '@/components/site/tracking-scripts'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { slug } = await params

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <TrackingScripts storeSlug={slug} />
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
}
