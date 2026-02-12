export interface FAQItem {
  question: string
  answer: string
}

export interface ServiceItem {
  name: string
  description: string
  seoTitle?: string
  seoDescription?: string
  longDescription?: string
}

export interface MarketingCopy {
  brandName: string
  slug: string
  heroTitle: string
  heroSubtitle: string
  aboutSection: string
  seoTitle: string
  seoDescription: string
  services: ServiceItem[]
  faq: FAQItem[]
  neighborhoods: string[]
}

export interface MarketingCopyInput {
  businessName: string
  category: string
  city: string
  state: string
  rating?: number
  reviewCount?: number
  googleAbout?: string
  website?: string
  priceRange?: string
  reviewHighlights?: string
  businessTypes?: string[]
  address?: string
  openingHours?: Record<string, string>
  businessAttributes?: string[]
}

export interface ServiceDescriptionInput {
  businessName: string
  category: string
  existingServices?: string[]
}

export interface InstitutionalPageContent {
  title: string
  content: string
  seoTitle: string
  seoDescription: string
}

export interface InstitutionalPages {
  about: InstitutionalPageContent
  contact: InstitutionalPageContent
}

export interface BusinessClassificationInput {
  businessName: string
  primaryType?: string
  reviews?: Array<{ rating: number; text?: { text: string } }>
}

export type AIProvider = 'gemini' | 'openai'

export const AI_PROVIDER: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'openai'
