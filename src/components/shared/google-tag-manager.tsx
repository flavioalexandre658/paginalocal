"use client"

import { useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    gtmLoaded?: boolean
    dataLayer?: Record<string, unknown>[]
  }
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

const EXCLUDED_PATHS = ["/store", "/platform", "/site"]

function shouldExcludeGTM(pathname: string): boolean {
  return EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
}

export function GoogleTagManager() {
  const pathname = usePathname()
  const loadedRef = useRef(false)

  const loadGTM = useCallback(() => {
    if (!GTM_ID) return
    if (loadedRef.current) return
    if (window.gtmLoaded) return

    loadedRef.current = true
    window.gtmLoaded = true

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    })

    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!GTM_ID || shouldExcludeGTM(pathname)) return

    if (typeof document === "undefined") return
    if ((document as unknown as { contentType?: string }).contentType &&
      !(document as unknown as { contentType: string }).contentType.includes("html")) {
      return
    }

    const triggerEvents = ["scroll", "mousemove", "touchstart", "click", "keydown"]

    triggerEvents.forEach((evt) =>
      window.addEventListener(evt, loadGTM, { once: true, passive: true })
    )

    const timeout = setTimeout(loadGTM, 5000)

    return () => {
      triggerEvents.forEach((evt) => window.removeEventListener(evt, loadGTM))
      clearTimeout(timeout)
    }
  }, [pathname, loadGTM])

  if (!GTM_ID || shouldExcludeGTM(pathname)) {
    return null
  }

  return null
}

export function GoogleTagManagerNoScript() {
  const pathname = usePathname()

  if (!GTM_ID || shouldExcludeGTM(pathname)) {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  )
}
