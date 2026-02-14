'use client'

import { useState } from 'react'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import { getWhatsAppUrl, getWhatsAppDefaultMessage } from '@/lib/utils'
import { useTrackClick } from '@/hooks/use-track-click'

interface WhatsAppFabProps {
  store: {
    id: string
    name: string
    slug: string
    whatsapp: string
    whatsappDefaultMessage?: string | null
    isActive: boolean
  }
  isOwner?: boolean
}

export function WhatsAppFab({ store, isOwner = false }: WhatsAppFabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { trackClick } = useTrackClick()
  const message = getWhatsAppDefaultMessage(store.name, store.whatsappDefaultMessage)

  const handleClick = async () => {
    if (store.isActive) {
      trackClick({
        storeId: store.id,
        source: 'whatsapp',
        touchpoint: 'floating_whatsapp',
      })

      window.open(getWhatsAppUrl(store.whatsapp, message), '_blank')
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/40 md:flex"
        aria-label="Contato via WhatsApp"
      >
        <IconBrandWhatsapp size={32} />
      </button>

    </>
  )
}
