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
  }
  isOwner?: boolean
}

export function HeroContactButtons({ store, isOwner = false }: HeroContactButtonsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <ContactButton
        store={store}
        type="whatsapp"
        variant="hero"
        isOwner={isOwner}
      />
      <ContactButton
        store={store}
        type="phone"
        variant="hero"
        isOwner={isOwner}
      />
    </div>
  )
}
