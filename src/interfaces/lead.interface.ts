export type LeadSource = 'whatsapp' | 'call' | 'form' | 'map'

export type LeadDevice = 'mobile' | 'desktop'

export interface ILead {
  id: string
  storeId: string
  name: string | null
  phone: string | null
  source: LeadSource
  device: LeadDevice | null
  referrer: string | null
  createdAt: Date
}

export interface ICreateLead {
  storeId: string
  source: LeadSource
  name?: string
  phone?: string
  device?: LeadDevice
  referrer?: string
}

export interface ILeadMetrics {
  total: number
  whatsapp: number
  call: number
  form: number
  map: number
  mobile: number
  desktop: number
}
