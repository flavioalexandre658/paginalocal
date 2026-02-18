import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(valueInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function generateCitySlug(city: string): string {
  return generateSlug(city)
}

export function formatCityFromSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const phoneWithCountry = cleaned.startsWith('55') ? cleaned : `55${cleaned}`
  const baseUrl = `https://wa.me/${phoneWithCountry}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}

export function getWhatsAppDefaultMessage(storeName: string, customMessage?: string | null): string {
  return customMessage?.trim() || `Olá! Vi o site da ${storeName} e gostaria de mais informações.`
}

export function getPhoneUrl(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const phoneWithCountry = cleaned.startsWith('55') ? cleaned : `55${cleaned}`
  return `tel:+${phoneWithCountry}`
}

export function getStoreUrl(slug: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/site/${slug}`
  }
  return `https://${slug}.paginalocal.com.br`
}

export function getProductPageUrl(storeSlug: string, productSlug: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `/site/${storeSlug}/produto/${productSlug}`
  }
  return `/produto/${productSlug}`
}

export function getCollectionPageUrl(storeSlug: string, collectionSlug: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `/site/${storeSlug}/catalogo/${collectionSlug}`
  }
  return `/catalogo/${collectionSlug}`
}

export function getPlanosPageUrl(storeSlug: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `/site/${storeSlug}/planos`
  }
  return `/planos`
}

export function getServicePageUrl(storeSlug: string, serviceSlug: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `/site/${storeSlug}/servicos/${serviceSlug}`
  }
  return `/servicos/${serviceSlug}`
}

export function getInstitutionalPageUrl(storeSlug: string, pageSlug: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `/site/${storeSlug}/${pageSlug}`
  }
  return `/${pageSlug}`
}

export function getStoreHomeUrl(storeSlug: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `/site/${storeSlug}`
  }
  return '/'
}
