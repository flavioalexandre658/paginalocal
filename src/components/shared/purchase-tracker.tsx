'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { getRecentPurchaseAction } from '@/actions/subscriptions/get-recent-purchase.action'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function PurchaseTracker() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const hasTracked = useRef(false)

  const { executeAsync } = useAction(getRecentPurchaseAction)

  useEffect(() => {
    const isSuccess = searchParams.get('subscription') === 'success'

    if (!isSuccess || hasTracked.current) return

    const trackPurchase = async () => {
      hasTracked.current = true

      const result = await executeAsync()

      if (!result?.data) return

      const purchaseData = result.data

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const purchaseDate = new Date(purchaseData.createdAt)

      if (purchaseDate < fiveMinutesAgo) {
        removeSuccessParam()
        return
      }

      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ ecommerce: null })

        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: purchaseData.transactionId,
            value: purchaseData.value,
            currency: purchaseData.currency,
            items: [
              {
                item_id: purchaseData.planId,
                item_name: purchaseData.planName,
                item_category: purchaseData.planType,
                item_variant: purchaseData.billingInterval,
                price: purchaseData.value,
                quantity: 1,
              },
            ],
          },
        })
      }

      removeSuccessParam()
    }

    const removeSuccessParam = () => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('subscription')
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(newUrl, { scroll: false })
    }

    trackPurchase()
  }, [searchParams, executeAsync, router, pathname])

  return null
}
