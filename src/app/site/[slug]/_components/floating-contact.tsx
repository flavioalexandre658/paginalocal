'use client'

import { useEffect, useState } from 'react'
import { IconPhone } from '@tabler/icons-react'
import { getWhatsAppUrl, getPhoneUrl, getWhatsAppDefaultMessage } from '@/lib/utils'
import { useTrackClick } from '@/hooks/use-track-click'
import { getContrastColor } from '@/lib/color-contrast'

interface FloatingContactProps {
  store: {
    id: string
    name: string
    slug: string
    whatsapp: string
    phone?: string | null
    whatsappDefaultMessage?: string | null
    isActive: boolean
    showWhatsappButton: boolean
    showCallButton: boolean
    buttonColor?: string | null
  }
  isOwner?: boolean
}

export function FloatingContact({ store, isOwner = false }: FloatingContactProps) {
  const [showMobileBar, setShowMobileBar] = useState(false)
  const { trackClick } = useTrackClick()

  const whatsappLink = getWhatsAppUrl(store.whatsapp, getWhatsAppDefaultMessage(store.name, store.whatsappDefaultMessage))
  const phoneLink = getPhoneUrl(store.phone || store.whatsapp)
  const btnColor = store.buttonColor || '#22c55e'
  const btnTextColor = getContrastColor(btnColor)

  const showWhatsapp = store.showWhatsappButton
  const showCall = store.showCallButton && (store.phone || store.whatsapp)
  const hasAnyButton = showWhatsapp || showCall

  useEffect(() => {
    function handleScroll() {
      const heroHeight = window.innerHeight * 0.7
      setShowMobileBar(window.scrollY > heroHeight)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleClick(e: React.MouseEvent, type: 'whatsapp' | 'phone') {
    if (!store.isActive) {
      e.preventDefault()
      return
    }

    trackClick({
      storeId: store.id,
      source: type === 'whatsapp' ? 'whatsapp' : 'call',
      touchpoint: type === 'whatsapp' ? 'floating_whatsapp' : 'floating_bar_call',
    })
  }

  if (!hasAnyButton) return null

  return (
    <>
      {/* Desktop Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 md:flex">
        {showCall && (
          <a
            href={phoneLink}
            onClick={(e) => handleClick(e, 'phone')}
            className="group relative flex items-center justify-center"
            aria-label="Ligar agora"
          >
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-all duration-300 hover:scale-110" style={{ boxShadow: `0 10px 25px -5px var(--primary, #3b82f6)40` }}>
              <IconPhone className="h-6 w-6" />
            </span>
          </a>
        )}

        {showWhatsapp && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleClick(e, 'whatsapp')}
            className="group relative flex items-center justify-center"
            aria-label="Conversar no WhatsApp"
          >
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-20"
              style={{ backgroundColor: btnColor }}
            />
            <span
              className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: btnColor,
                color: btnTextColor,
                boxShadow: `0 15px 30px -5px ${btnColor}40`,
              }}
            >
              <WhatsAppIcon className="h-8 w-8" />
            </span>
          </a>
        )}
      </div>

      {/* Mobile Sticky Bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-lg transition-transform duration-300 md:hidden dark:border-slate-800 dark:bg-slate-900/95 ${showMobileBar ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className={`flex gap-3 ${showWhatsapp && showCall ? 'grid grid-cols-2' : ''}`}>
          {showCall && (
            <a
              href={phoneLink}
              onClick={(e) => handleClick(e, 'phone')}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white py-3 font-bold text-slate-800 transition-all active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <IconPhone className="h-5 w-5" />
              <span>Ligar</span>
            </a>
          )}

          {showWhatsapp && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleClick(e, 'whatsapp')}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold text-white shadow-md transition-all active:scale-[0.98]"
              style={{
                backgroundColor: btnColor,
                boxShadow: `0 4px 12px ${btnColor}30`,
              }}
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>

    </>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
