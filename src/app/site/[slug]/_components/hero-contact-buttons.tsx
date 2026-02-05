'use client'

import { ContactButton } from '@/components/site/contact-button'

interface HeroContactButtonsProps {
  store: {
    id: string
    name: string
    slug: string
    whatsapp: string
    phone?: string | null
    isActive: boolean
    showWhatsappButton: boolean
    showCallButton: boolean
  }
  isOwner?: boolean
}

export function HeroContactButtons({ store, isOwner = false }: HeroContactButtonsProps) {
  const showWhatsapp = store.showWhatsappButton
  const showCall = store.showCallButton && (store.phone || store.whatsapp)

  if (!showWhatsapp && !showCall) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      {showWhatsapp && (
        <ContactButton
          store={store}
          type="whatsapp"
          variant="hero"
          isOwner={isOwner}
        />
      )}
      {showCall && (
        <ContactButton
          store={store}
          type="phone"
          variant="hero"
          isOwner={isOwner}
        />
      )}
    </div>
  )
}
