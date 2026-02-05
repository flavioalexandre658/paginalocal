import Script from 'next/script'
import { db } from '@/db'
import { tracking, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import {
  getGTMHeadScript,
  getGTMBodyScript,
  getGoogleAnalyticsScript,
  getGoogleAnalyticsUrl,
  getGoogleAdsScript,
  getMetaPixelScript,
  getMetaPixelNoscript,
  getKwaiPixelScript,
  getTikTokPixelScript,
} from '@/lib/tracking-scripts'

interface TrackingScriptsProps {
  storeSlug: string
}

export async function TrackingScripts({ storeSlug }: TrackingScriptsProps) {
  const [storeData] = await db
    .select({ id: store.id, isActive: store.isActive })
    .from(store)
    .where(eq(store.slug, storeSlug))
    .limit(1)

  if (!storeData || !storeData.isActive) {
    return null
  }

  const trackingConfigs = await db
    .select()
    .from(tracking)
    .where(and(eq(tracking.storeId, storeData.id), eq(tracking.isActive, true)))

  if (trackingConfigs.length === 0) {
    return null
  }

  const gtmConfig = trackingConfigs.find((t) => t.platform === 'GTM')
  const gaConfig = trackingConfigs.find((t) => t.platform === 'GOOGLE_ANALYTICS')
  const adsConfig = trackingConfigs.find((t) => t.platform === 'GOOGLE_ADS')
  const metaConfig = trackingConfigs.find((t) => t.platform === 'META_PIXEL')
  const kwaiConfig = trackingConfigs.find((t) => t.platform === 'KWAI')
  const tiktokConfig = trackingConfigs.find((t) => t.platform === 'TIKTOK')

  return (
    <>
      {gtmConfig && (
        <>
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: getGTMHeadScript(gtmConfig.trackingId) }}
          />
          <noscript>
            <div dangerouslySetInnerHTML={{ __html: getGTMBodyScript(gtmConfig.trackingId) }} />
          </noscript>
        </>
      )}

      {gaConfig && (
        <>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={getGoogleAnalyticsUrl(gaConfig.trackingId)}
          />
          <Script
            id="ga-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: getGoogleAnalyticsScript(gaConfig.trackingId) }}
          />
        </>
      )}

      {adsConfig && (
        <>
          <Script
            id="ads-src"
            strategy="afterInteractive"
            src={getGoogleAnalyticsUrl(adsConfig.trackingId)}
          />
          <Script
            id="ads-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: getGoogleAdsScript(adsConfig.trackingId) }}
          />
        </>
      )}

      {metaConfig && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: getMetaPixelScript(metaConfig.trackingId) }}
          />
          <noscript>
            <div dangerouslySetInnerHTML={{ __html: getMetaPixelNoscript(metaConfig.trackingId) }} />
          </noscript>
        </>
      )}

      {kwaiConfig && (
        <Script
          id="kwai-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: getKwaiPixelScript(kwaiConfig.trackingId) }}
        />
      )}

      {tiktokConfig && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: getTikTokPixelScript(tiktokConfig.trackingId) }}
        />
      )}
    </>
  )
}
