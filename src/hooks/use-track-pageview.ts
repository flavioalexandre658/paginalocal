'use client'

import { useEffect, useRef, useCallback } from 'react'
import { trackPageviewAction } from '@/actions/pageviews/track-pageview.action'

interface UseTrackPageviewParams {
  storeId: string
}

interface UtmParams {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
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

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  const storageKey = 'pgl_session_id'
  let sessionId = sessionStorage.getItem(storageKey)

  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem(storageKey, sessionId)
  }

  return sessionId
}

function getAndStoreUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {}

  const storageKey = 'pgl_utm_params'
  const urlParams = new URLSearchParams(window.location.search)

  const utmSource = urlParams.get('utm_source')
  const utmMedium = urlParams.get('utm_medium')
  const utmCampaign = urlParams.get('utm_campaign')
  const utmTerm = urlParams.get('utm_term')
  const utmContent = urlParams.get('utm_content')

  if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
    const utmParams: UtmParams = {
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      utmContent: utmContent || undefined,
    }
    sessionStorage.setItem(storageKey, JSON.stringify(utmParams))
    return utmParams
  }

  const stored = sessionStorage.getItem(storageKey)
  if (stored) {
    try {
      return JSON.parse(stored) as UtmParams
    } catch {
      return {}
    }
  }

  return {}
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {}
  
  const storageKey = 'pgl_utm_params'
  const stored = sessionStorage.getItem(storageKey)
  if (stored) {
    try {
      return JSON.parse(stored) as UtmParams
    } catch {
      return {}
    }
  }
  return {}
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem('pgl_session_id') || ''
}

export function getCurrentPageviewId(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('pgl_current_pageview_id')
}

function setCurrentPageviewId(pageviewId: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('pgl_current_pageview_id', pageviewId)
}

export function useTrackPageview({ storeId }: UseTrackPageviewParams) {
  const hasTrackedRef = useRef(false)
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

  useEffect(() => {
    if (hasTrackedRef.current) return
    hasTrackedRef.current = true

    const trackPageview = async () => {
      const device = getDevice()
      const referrer = parseReferrer(document.referrer)
      const sessionId = getOrCreateSessionId()
      const userAgent = navigator.userAgent
      const location = await fetchLocation()
      const utmParams = getAndStoreUtmParams()

      const result = await trackPageviewAction({
        storeId,
        device,
        referrer,
        location: location || undefined,
        userAgent,
        sessionId,
        ...utmParams,
      })

      // Armazena o ID da pageview atual para vincular aos leads
      if (result?.data?.id) {
        setCurrentPageviewId(result.data.id)
      }
    }

    trackPageview()
  }, [storeId, fetchLocation])
}
