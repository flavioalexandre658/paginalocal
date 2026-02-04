export type OpeningHours = Record<string, string>

export interface IStore {
  id: string
  userId: string
  name: string
  slug: string
  customDomain: string | null
  description: string | null
  category: string
  phone: string
  whatsapp: string
  address: string
  city: string
  state: string
  zipCode: string | null
  latitude: string | null
  longitude: string | null
  googlePlaceId: string | null
  googleRating: string | null
  googleReviewsCount: number | null
  logoUrl: string | null
  coverUrl: string | null
  primaryColor: string | null
  openingHours: OpeningHours | null
  seoTitle: string | null
  seoDescription: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICreateStore {
  name: string
  slug: string
  category: string
  phone: string
  whatsapp: string
  address: string
  city: string
  state: string
  customDomain?: string
  description?: string
  zipCode?: string
  latitude?: string
  longitude?: string
  googlePlaceId?: string
  logoUrl?: string
  coverUrl?: string
  primaryColor?: string
  openingHours?: OpeningHours
  seoTitle?: string
  seoDescription?: string
}

export interface IUpdateStore {
  name?: string
  slug?: string
  customDomain?: string | null
  description?: string | null
  category?: string
  phone?: string
  whatsapp?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string | null
  latitude?: string | null
  longitude?: string | null
  googlePlaceId?: string | null
  googleRating?: string | null
  googleReviewsCount?: number | null
  logoUrl?: string | null
  coverUrl?: string | null
  primaryColor?: string | null
  openingHours?: OpeningHours | null
  seoTitle?: string | null
  seoDescription?: string | null
  isActive?: boolean
}
