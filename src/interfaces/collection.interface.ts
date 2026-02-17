export interface ICollection {
  id: string
  storeId: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  seoTitle: string | null
  seoDescription: string | null
  isActive: boolean
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface ICreateCollection {
  storeId: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  seoTitle?: string
  seoDescription?: string
  isActive?: boolean
  position?: number
}

export interface IUpdateCollection {
  name?: string
  slug?: string
  description?: string
  imageUrl?: string
  seoTitle?: string
  seoDescription?: string
  isActive?: boolean
  position?: number
}
