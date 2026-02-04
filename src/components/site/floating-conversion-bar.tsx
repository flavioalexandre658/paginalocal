'use client'

import { IconBrandWhatsapp, IconPhone } from '@tabler/icons-react'
import { getWhatsAppUrl, getPhoneUrl } from '@/lib/utils'

interface FloatingConversionBarProps {
  whatsapp: string
  phone: string
  storeName: string
}

export function FloatingConversionBar({ whatsapp, phone, storeName }: FloatingConversionBarProps) {
  const whatsappMessage = `Olá! Vi o site da ${storeName} e gostaria de mais informações.`

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppUrl(whatsapp, whatsappMessage), '_blank')
  }

  const handlePhoneClick = () => {
    window.location.href = getPhoneUrl(phone)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="grid grid-cols-2 bg-background border-t shadow-lg">
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
        >
          <IconBrandWhatsapp size={24} />
          <span>WhatsApp</span>
        </button>
        <button
          onClick={handlePhoneClick}
          className="flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          <IconPhone size={24} />
          <span>Ligar</span>
        </button>
      </div>
    </div>
  )
}
