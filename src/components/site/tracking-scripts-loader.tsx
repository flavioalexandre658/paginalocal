'use client'

import { useEffect, useCallback, useRef } from 'react'
import type { TrackingConfig } from './tracking-scripts'
import {
  getGTMHeadScript,
  getGoogleAnalyticsScript,
  getGoogleAnalyticsUrl,
  getGoogleAdsScript,
  getMetaPixelScript,
  getKwaiPixelScript,
  getTikTokPixelScript,
} from '@/lib/tracking-scripts'

interface TrackingScriptsLoaderProps {
  configs: TrackingConfig[]
}

declare global {
  interface Window {
    _pglTrackingLoaded?: boolean
    dataLayer?: Record<string, unknown>[]
  }
}

const INTERACTION_EVENTS = ['scroll', 'mousemove', 'touchstart', 'click', 'keydown']
const LAZY_TIMEOUT_MS = 4000

function injectInlineScript(id: string, code: string) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.textContent = code
  document.head.appendChild(script)
}

function injectExternalScript(id: string, src: string) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function loadTrackingScripts(configs: TrackingConfig[]) {
  for (const config of configs) {
    switch (config.platform) {
      case 'GTM':
        injectInlineScript(`pgl-gtm-${config.trackingId}`, getGTMHeadScript(config.trackingId))
        break

      case 'GOOGLE_ANALYTICS':
        injectExternalScript(`pgl-ga-src-${config.trackingId}`, getGoogleAnalyticsUrl(config.trackingId))
        injectInlineScript(`pgl-ga-cfg-${config.trackingId}`, getGoogleAnalyticsScript(config.trackingId))
        break

      case 'GOOGLE_ADS':
        injectExternalScript(`pgl-ads-src-${config.trackingId}`, getGoogleAnalyticsUrl(config.trackingId))
        injectInlineScript(`pgl-ads-cfg-${config.trackingId}`, getGoogleAdsScript(config.trackingId))
        break

      case 'META_PIXEL':
        injectInlineScript(`pgl-meta-${config.trackingId}`, getMetaPixelScript(config.trackingId))
        break

      case 'KWAI':
        injectInlineScript(`pgl-kwai-${config.trackingId}`, getKwaiPixelScript(config.trackingId))
        break

      case 'TIKTOK':
        injectInlineScript(`pgl-tiktok-${config.trackingId}`, getTikTokPixelScript(config.trackingId))
        break
    }
  }
}

export function TrackingScriptsLoader({ configs }: TrackingScriptsLoaderProps) {
  const loadedRef = useRef(false)

  const load = useCallback(() => {
    if (loadedRef.current) return
    if (window._pglTrackingLoaded) return

    loadedRef.current = true
    window._pglTrackingLoaded = true

    loadTrackingScripts(configs)
  }, [configs])

  useEffect(() => {
    if (configs.length === 0) return

    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, load, { once: true, passive: true })
    )

    const timeout = setTimeout(load, LAZY_TIMEOUT_MS)

    return () => {
      INTERACTION_EVENTS.forEach((evt) => window.removeEventListener(evt, load))
      clearTimeout(timeout)
    }
  }, [configs, load])

  return null
}
