'use client'

import { useState } from 'react'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import { getWhatsAppUrl } from '@/lib/utils'
import { DraftContactModal } from './draft-contact-modal'

interface WhatsAppFabProps {
  store: {
    id: string
    name: string
    slug: string
    whatsapp: string
    isActive: boolean
  }
  isOwner?: boolean
}

export function WhatsAppFab({ store, isOwner = false }: WhatsAppFabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const message = `Olá! Vi o site da ${store.name} e gostaria de mais informações.`

  const handleClick = () => {
    if (store.isActive) {
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

      <DraftContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeName={store.name}
        storeSlug={store.slug}
        storeId={store.id}
        isOwner={isOwner}
        contactType="whatsapp"
      />
    </>
  )
}
