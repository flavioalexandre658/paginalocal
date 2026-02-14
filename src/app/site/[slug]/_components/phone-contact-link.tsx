'use client'

import { getPhoneUrl } from '@/lib/utils'
import { useTrackClick } from '@/hooks/use-track-click'

interface PhoneContactLinkProps {
  store: {
    id: string
    name: string
    slug: string
    phone: string
    isActive: boolean
  }
  formattedPhone: string
}

export function PhoneContactLink({ store, formattedPhone }: PhoneContactLinkProps) {
  const { trackClick } = useTrackClick()

  async function handleClick(e: React.MouseEvent) {
    if (!store.isActive) {
      e.preventDefault()
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

    </>
  )
}
