export interface IService {
  id: string
  storeId: string
  name: string
  description: string | null
  priceInCents: number | null
  imageUrl: string | null
  position: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICreateService {
  storeId: string
  name: string
  description?: string
  priceInCents?: number
  imageUrl?: string
  position?: number
}

export interface IUpdateService {
  name?: string
  description?: string | null
  priceInCents?: number | null
  imageUrl?: string | null
  position?: number
  isActive?: boolean
}
