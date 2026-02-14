'use client'

import { useState } from 'react'
import { IconPhone } from '@tabler/icons-react'
import { getWhatsAppUrl, getPhoneUrl, getWhatsAppDefaultMessage, cn } from '@/lib/utils'
import { useTrackClick } from '@/hooks/use-track-click'
import { getContrastColor, isLightColor } from '@/lib/color-contrast'

interface ContactButtonProps {
  store: {
    id: string
    name: string
    slug: string
    whatsapp: string
    phone?: string | null
    whatsappDefaultMessage?: string | null
    isActive: boolean
    buttonColor?: string | null
    heroBackgroundColor?: string | null
  }
  type: 'whatsapp' | 'phone'
  isOwner?: boolean
  variant?: 'hero' | 'floating' | 'outline'
  className?: string
  children?: React.ReactNode
}

export function ContactButton({
  store,
  type,
  isOwner = false,
  variant = 'hero',
  className,
  children,
}: ContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { trackClick } = useTrackClick()

  const phoneNumber = store.phone || store.whatsapp
  const whatsappLink = getWhatsAppUrl(store.whatsapp, getWhatsAppDefaultMessage(store.name, store.whatsappDefaultMessage))
  const phoneLink = getPhoneUrl(phoneNumber)
  const btnColor = store.buttonColor || '#22c55e'
  const btnTextColor = getContrastColor(btnColor)
  const heroBg = store.heroBackgroundColor || '#1e293b'
  const heroIsLight = isLightColor(heroBg)

  async function handleClick(e: React.MouseEvent) {
    if (!store.isActive) {
      e.preventDefault()
      setIsModalOpen(true)
      return
    }

    const touchpoint = type === 'whatsapp' ? 'hero_whatsapp' : 'hero_call'
    const source = type === 'whatsapp' ? 'whatsapp' : 'call'

    trackClick({
      storeId: store.id,
      source,
      touchpoint,
    })
  }

  const useCustomColor = type === 'whatsapp' && store.buttonColor

  const phoneHeroStyle = heroIsLight
    ? 'inline-flex items-center gap-3 rounded-full border-2 border-black/20 bg-black/5 px-7 py-3.5 text-base font-bold text-slate-900 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-black/10 sm:px-9 sm:py-4 sm:text-lg'
    : 'inline-flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:px-9 sm:py-4 sm:text-lg'

  const variantStyles = {
    hero: type === 'whatsapp'
      ? 'inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-base font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:px-9 sm:py-4 sm:text-lg'
      : phoneHeroStyle,
    floating: 'group flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl',
    outline: 'inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-primary/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
  }

  const inlineStyle = (type === 'whatsapp' && variant !== 'outline')
    ? {
      backgroundColor: btnColor,
      color: '#ffffff',
      boxShadow: `0 10px 15px -3px ${btnColor}40`,
    }
    : undefined

  const href = type === 'whatsapp' ? whatsappLink : phoneLink

  return (
    <>
      <a
        href={href}
        target={type === 'whatsapp' ? '_blank' : undefined}
        rel={type === 'whatsapp' ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        className={cn(variantStyles[variant], className)}
        style={inlineStyle}
      >
        {children || (
          <>
            {type === 'whatsapp' ? (
              <>
                <WhatsAppIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                {variant !== 'floating' && 'Falar no WhatsApp'}
              </>
            ) : (
              <>
                <IconPhone className="h-5 w-5" />
                {variant !== 'floating' && 'Ligar Agora'}
              </>
            )}
          </>
        )}
      </a>

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
