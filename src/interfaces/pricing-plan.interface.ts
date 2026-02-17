import type { PricingInterval, PricingCtaMode } from '@/db/schema'

export interface IPricingPlan {
  id: string
  storeId: string
  name: string
  description: string | null
  priceInCents: number
  interval: PricingInterval
  features: string[] | null
  isHighlighted: boolean
  isActive: boolean
  ctaMode: PricingCtaMode
  ctaLabel: string | null
  ctaExternalUrl: string | null
  ctaWhatsappMessage: string | null
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface ICreatePricingPlan {
  storeId: string
  name: string
  description?: string
  priceInCents: number
  interval?: PricingInterval
  features?: string[]
  isHighlighted?: boolean
  isActive?: boolean
  ctaMode?: PricingCtaMode
  ctaLabel?: string
  ctaExternalUrl?: string
  ctaWhatsappMessage?: string
  position?: number
}

export interface IUpdatePricingPlan {
  name?: string
  description?: string
  priceInCents?: number
  interval?: PricingInterval
  features?: string[]
  isHighlighted?: boolean
  isActive?: boolean
  ctaMode?: PricingCtaMode
  ctaLabel?: string
  ctaExternalUrl?: string
  ctaWhatsappMessage?: string
  position?: number
}

export { PricingInterval, PricingCtaMode }
