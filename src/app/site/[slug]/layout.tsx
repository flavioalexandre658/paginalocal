import { ReactNode } from 'react'
import { TrackingScripts } from '@/components/site/tracking-scripts'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

async function getStoreColors(slug: string) {
  const [storeData] = await db
    .select({
      primaryColor: store.primaryColor,
      heroBackgroundColor: store.heroBackgroundColor,
      buttonColor: store.buttonColor,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  return storeData || null
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const colors = await getStoreColors(slug)

  const cssVars: Record<string, string> = {}
  if (colors?.primaryColor) {
    cssVars['--primary'] = colors.primaryColor
  }
  if (colors?.heroBackgroundColor) {
    cssVars['--store-hero-bg'] = colors.heroBackgroundColor
  }
  if (colors?.buttonColor) {
    cssVars['--store-button-color'] = colors.buttonColor
  }

  return (
    <div
      className="relative w-full max-w-full min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      style={cssVars as React.CSSProperties}
    >
      <TrackingScripts storeSlug={slug} />
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
}
