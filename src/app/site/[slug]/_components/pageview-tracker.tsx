'use client'

import { useTrackPageview } from '@/hooks/use-track-pageview'

interface PageviewTrackerProps {
  storeId: string
}

export function PageviewTracker({ storeId }: PageviewTrackerProps) {
  useTrackPageview({ storeId })
  return null
}
