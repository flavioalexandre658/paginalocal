import { db } from '@/db'
import { tracking, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { TrackingScriptsLoader } from './tracking-scripts-loader'

interface TrackingScriptsProps {
  storeSlug: string
}

export interface TrackingConfig {
  platform: string
  trackingId: string
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
    .select({
      platform: tracking.platform,
      trackingId: tracking.trackingId,
    })
    .from(tracking)
    .where(and(eq(tracking.storeId, storeData.id), eq(tracking.isActive, true)))

  if (trackingConfigs.length === 0) {
    return null
  }

  const metaConfig = trackingConfigs.find((t) => t.platform === 'META_PIXEL')

  return (
    <>
      <TrackingScriptsLoader configs={trackingConfigs} />
      {metaConfig && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaConfig.trackingId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  )
}
