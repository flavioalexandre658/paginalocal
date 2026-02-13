declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

export function trackWhatsAppClick(location: string) {
  if (typeof window === 'undefined') return

  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'whatsapp_click',
      click_location: location,
    })
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_name: 'WhatsApp Click',
      content_category: location,
    })
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'WhatsApp',
      event_label: location,
    })
  }
}
