import { ReactNode } from 'react'
import { TrackingScripts } from '@/components/site/tracking-scripts'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { SiteHeader } from './_components/site-header'
import { DraftBanner } from '@/components/site/draft-banner'
import { getSiteFontUrl, getSiteFontFamily } from '@/lib/font-loader'
import { auth } from '@/lib/auth'

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
      isActive: store.isActive,
      userId: store.userId,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  return storeData || null
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const [data, session] = await Promise.all([
    getStoreLayoutData(slug),
    auth.api.getSession({ headers: await headers() }),
  ])

  const isDraft = !data?.isActive
  const isOwner = session?.user?.id === data?.userId

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

      {/* Preconnect + DNS prefetch */}
      {/* Preconnect úteis apenas */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />


      <link rel="dns-prefetch" href="https://stagingfy-images.s3.amazonaws.com" />


      {/* Font só carrega se tiver URL válida, e de forma não-bloqueante */}
      {fontUrl && (
        <link rel="stylesheet" href={fontUrl} crossOrigin="anonymous" />
      )}


      {/* Preload cover image com prioridade 
      {data?.coverUrl && (
        <>
          <link
            rel="preload"
            as="image"
            href={`/_next/image?url=${encodeURIComponent(data.coverUrl)}&w=828&q=65`}
            media="(max-width: 768px)"
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            href={`/_next/image?url=${encodeURIComponent(data.coverUrl)}&w=1920&q=65`}
            media="(min-width: 769px)"
            fetchPriority="high"
          />
        </>
      )}*/}
      {/* Preload logo se existir 
      {data?.logoUrl && (
        <link
          rel="preload"
          as="image"
          href={`/_next/image?url=${encodeURIComponent(data.logoUrl)}&w=256&q=75`}
          fetchPriority="high"
        />
      )}*/}

      <div
        className="relative w-full max-w-full min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        style={{
          ...cssVars as React.CSSProperties,
          fontFamily: `'${fontFamily}', system-ui, sans-serif`,
        }}
      >
        <TrackingScripts storeSlug={slug} />

        {isDraft && isOwner && <DraftBanner isOwner={isOwner} />}

        <div className="relative z-10 flex min-h-screen flex-col">
          {/* Spacer to push content below the fixed DraftBanner (owner only) */}
          {isDraft && isOwner && <div className="h-10 shrink-0 sm:h-11" />}

          {showHeader && data && (!isDraft || isOwner) && (
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