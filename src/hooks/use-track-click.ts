'use client'

import { useCallback, useRef } from 'react'
import { trackClickAction } from '@/actions/leads/track-click.action'
import { getSessionId, getStoredUtmParams, getCurrentPageviewId } from './use-track-pageview'

type LeadSource = 'whatsapp' | 'call' | 'form' | 'map'
type LeadTouchpoint =
  | 'hero_whatsapp'
  | 'hero_call'
  | 'floating_whatsapp'
  | 'contact_call'
  | 'floating_bar_whatsapp'
  | 'floating_bar_call'

interface TrackClickParams {
  storeId: string
  source: LeadSource
  touchpoint: LeadTouchpoint
}

function getDevice(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  return window.innerWidth < 768 ? 'mobile' : 'desktop'
}

function parseReferrer(referrer: string): string {
  if (!referrer) return 'direct'

  const url = referrer.toLowerCase()

  if (url.includes('google')) return 'google'
  if (url.includes('instagram')) return 'instagram'
  if (url.includes('facebook') || url.includes('fb.com')) return 'facebook'
  if (url.includes('tiktok')) return 'tiktok'
  if (url.includes('youtube')) return 'youtube'
  if (url.includes('twitter') || url.includes('x.com')) return 'twitter'
  if (url.includes('linkedin')) return 'linkedin'
  if (url.includes('whatsapp')) return 'whatsapp'

  return 'other'
}

export function useTrackClick() {
  const locationRef = useRef<string | null>(null)
  const locationFetchedRef = useRef(false)

  const fetchLocation = useCallback(async () => {
    if (locationFetchedRef.current) return locationRef.current

    try {
      const response = await fetch('/api/geo')
      const data = await response.json()

      if (data.city) {
        locationRef.current = data.region
          ? `${data.city}, ${data.region}`
          : data.city
      }

      locationFetchedRef.current = true
    } catch {
      locationFetchedRef.current = true
    }

    return locationRef.current
  }, [])

  const trackClick = useCallback(
    async ({ storeId, source, touchpoint }: TrackClickParams) => {
      const device = getDevice()
      const referrer = parseReferrer(
        typeof document !== 'undefined' ? document.referrer : ''
      )
      const location = await fetchLocation()
      const sessionId = getSessionId()
      const pageviewId = getCurrentPageviewId()
      const utmParams = getStoredUtmParams()

      await trackClickAction({
        storeId,
        source,
        device,
        referrer,
        location: location || undefined,
        touchpoint,
        sessionId: sessionId || undefined,
        pageviewId: pageviewId || undefined,
        ...utmParams,
      })
    },
    [fetchLocation]
  )

  return { trackClick }
}
