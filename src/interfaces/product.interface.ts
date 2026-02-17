import type { ProductStatus, ProductCtaMode, ProductImage } from '@/db/schema'

export interface IProduct {
  id: string
  storeId: string
  collectionId: string | null
  name: string
  slug: string
  description: string | null
  longDescription: string | null
  priceInCents: number
  originalPriceInCents: number | null
  images: ProductImage[] | null
  ctaMode: ProductCtaMode
  ctaLabel: string | null
  ctaExternalUrl: string | null
  ctaWhatsappMessage: string | null
  seoTitle: string | null
  seoDescription: string | null
  status: ProductStatus
  isFeatured: boolean
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface ICreateProduct {
  storeId: string
  collectionId?: string | null
  name: string
  slug: string
  description?: string
  longDescription?: string
  priceInCents: number
  originalPriceInCents?: number
  images?: ProductImage[]
  ctaMode?: ProductCtaMode
  ctaLabel?: string
  ctaExternalUrl?: string
  ctaWhatsappMessage?: string
  seoTitle?: string
  seoDescription?: string
  status?: ProductStatus
  isFeatured?: boolean
  position?: number
}

export interface IUpdateProduct {
  name?: string
  slug?: string
  description?: string
  longDescription?: string
  priceInCents?: number
  originalPriceInCents?: number
  images?: ProductImage[]
  collectionId?: string | null
  ctaMode?: ProductCtaMode
  ctaLabel?: string
  ctaExternalUrl?: string
  ctaWhatsappMessage?: string
  seoTitle?: string
  seoDescription?: string
  status?: ProductStatus
  isFeatured?: boolean
  position?: number
}

export { ProductStatus, ProductCtaMode, ProductImage }
