'use client'

import { useState } from 'react'
import { getPhoneUrl } from '@/lib/utils'
import { DraftContactModal } from '@/components/site/draft-contact-modal'
import { useTrackClick } from '@/hooks/use-track-click'

interface PhoneContactLinkProps {
  store: {
    id: string
    name: string
    slug: string
    phone: string
    isActive: boolean
  }
  isOwner?: boolean
  formattedPhone: string
}

export function PhoneContactLink({ store, isOwner = false, formattedPhone }: PhoneContactLinkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { trackClick } = useTrackClick()

  async function handleClick(e: React.MouseEvent) {
    if (!store.isActive) {
      e.preventDefault()
      setIsModalOpen(true)
      return
    }

    trackClick({
      storeId: store.id,
      source: 'call',
      touchpoint: 'contact_call',
    })
  }

  return (
    <>
      <a
        href={getPhoneUrl(store.phone)}
        onClick={handleClick}
        className="text-lg font-medium text-slate-700 transition-colors hover:text-emerald-600 dark:text-slate-200"
      >
        {formattedPhone}
      </a>

      <DraftContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeName={store.name}
        storeSlug={store.slug}
        storeId={store.id}
        isOwner={isOwner}
        contactType="phone"
      />
    </>
  )
}
