import { ReactNode } from 'react'
import { TrackingScripts } from '@/components/site/tracking-scripts'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { SiteHeader } from './_components/site-header'
import { getSiteFontUrl, getSiteFontFamily } from '@/lib/font-loader'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

async function getStoreLayoutData(slug: string) {
  const [storeData] = await db
    .select({
      name: store.name,
      slug: store.slug,
      primaryColor: store.primaryColor,
      heroBackgroundColor: store.heroBackgroundColor,
      buttonColor: store.buttonColor,
      logoUrl: store.logoUrl,
      coverUrl: store.coverUrl,
      whatsapp: store.whatsapp,
      whatsappDefaultMessage: store.whatsappDefaultMessage,
      showWhatsappButton: store.showWhatsappButton,
      fontFamily: store.fontFamily,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  return storeData || null
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const data = await getStoreLayoutData(slug)

  const cssVars: Record<string, string> = {}
  if (data?.primaryColor) {
    cssVars['--primary'] = data.primaryColor
  }
  if (data?.heroBackgroundColor) {
    cssVars['--store-hero-bg'] = data.heroBackgroundColor
  }
  if (data?.buttonColor) {
    cssVars['--store-button-color'] = data.buttonColor
  }

  const fontUrl = getSiteFontUrl(data?.fontFamily)
  const fontFamily = getSiteFontFamily(data?.fontFamily)

  const showHeader = !!data?.logoUrl

  return (
    <>
      {/* Preconnect + preload só da fonte usada */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" as="style" href={fontUrl!} />
      <link rel="stylesheet" href={fontUrl!} />

      <link rel="preconnect" href="https://stagingfy-images.s3.amazonaws.com" />
      {data?.coverUrl && (
        <link
          rel="preload"
          as="image"
          href={`/_next/image?url=${encodeURIComponent(
            data.coverUrl.replace(
              'https://stagingfy-images.s3.amazonaws.com/',
              '/img/'
            )
          )}&w=1920&q=50`}
          fetchPriority="high"
        />
      )}

      <div
        className="relative w-full max-w-full min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        style={{
          ...cssVars as React.CSSProperties,
          fontFamily: `'${fontFamily}', system-ui, sans-serif`,
        }}
      >
        <TrackingScripts storeSlug={slug} />
        <div className="relative z-10 flex min-h-screen flex-col">
          {showHeader && data && (
            <SiteHeader
              storeName={data.name}
              slug={data.slug}
              logoUrl={data.logoUrl!}
              whatsapp={data.whatsapp}
              whatsappDefaultMessage={data.whatsappDefaultMessage}
              buttonColor={data.buttonColor}
              showWhatsappButton={data.showWhatsappButton}
            />
          )}
          {children}
        </div>
      </div>
    </>
  )
}
