export interface ITestimonial {
  id: string
  storeId: string
  authorName: string
  content: string
  rating: number
  imageUrl: string | null
  isGoogleReview: boolean
  createdAt: Date
}

export interface ICreateTestimonial {
  storeId: string
  authorName: string
  content: string
  rating?: number
  imageUrl?: string
  isGoogleReview?: boolean
}

export interface IUpdateTestimonial {
  authorName?: string
  content?: string
  rating?: number
  imageUrl?: string | null
  isGoogleReview?: boolean
}
