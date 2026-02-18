import type { StoreSection, SectionType, StoreMode } from '@/db/schema'

/**
 * Gera sections default para LOCAL_BUSINESS (padrão)
 * Usado como fallback para stores.sections === null
 */
export function getDefaultSections(): StoreSection[] {
  return [
    { type: 'HERO', isActive: true, order: 0 },
    { type: 'STATS', isActive: true, order: 1 },
    { type: 'ABOUT', isActive: true, order: 2 },
    { type: 'SERVICES', isActive: true, order: 3 },
    { type: 'PRODUCTS', isActive: false, order: 4 },
    { type: 'PRICING_PLANS', isActive: false, order: 5 },
    { type: 'GALLERY', isActive: true, order: 6 },
    { type: 'AREAS', isActive: true, order: 7 },
    { type: 'TESTIMONIALS', isActive: true, order: 8 },
    { type: 'FAQ', isActive: true, order: 9 },
    { type: 'CONTACT', isActive: true, order: 10 },
  ]
}

/**
 * Gera sections default baseado no mode da loja
 */
export function getDefaultSectionsForMode(mode: StoreMode): StoreSection[] {
  switch (mode) {
    case 'PRODUCT_CATALOG':
      return [
        { type: 'HERO', isActive: true, order: 0 },
        { type: 'STATS', isActive: true, order: 1 },
        { type: 'PRODUCTS', isActive: true, order: 2 },
        { type: 'TESTIMONIALS', isActive: true, order: 3 },
        { type: 'FAQ', isActive: true, order: 4 },
        { type: 'AREAS', isActive: true, order: 5 },
        { type: 'CONTACT', isActive: true, order: 6 },
        // Ocultas
        { type: 'ABOUT', isActive: false, order: 7 },
        { type: 'SERVICES', isActive: false, order: 8 },
        { type: 'GALLERY', isActive: false, order: 9 },
        { type: 'PRICING_PLANS', isActive: false, order: 10 },
      ]

    case 'SERVICE_PRICING':
      return [
        { type: 'HERO', isActive: true, order: 0 },
        { type: 'STATS', isActive: true, order: 1 },
        { type: 'ABOUT', isActive: true, order: 2 },
        { type: 'SERVICES', isActive: true, order: 3 },
        { type: 'PRICING_PLANS', isActive: true, order: 4 },
        { type: 'TESTIMONIALS', isActive: true, order: 5 },
        { type: 'FAQ', isActive: true, order: 6 },
        { type: 'AREAS', isActive: true, order: 7 },
        { type: 'CONTACT', isActive: true, order: 8 },
        // Ocultas
        { type: 'PRODUCTS', isActive: false, order: 9 },
        { type: 'GALLERY', isActive: false, order: 10 },
      ]

    case 'HYBRID':
      return [
        { type: 'HERO', isActive: true, order: 0 },
        { type: 'STATS', isActive: true, order: 1 },
        { type: 'ABOUT', isActive: true, order: 2 },
        { type: 'SERVICES', isActive: true, order: 3 },
        { type: 'PRODUCTS', isActive: true, order: 4 },
        { type: 'PRICING_PLANS', isActive: true, order: 5 },
        { type: 'TESTIMONIALS', isActive: true, order: 6 },
        { type: 'FAQ', isActive: true, order: 7 },
        { type: 'AREAS', isActive: true, order: 8 },
        { type: 'CONTACT', isActive: true, order: 9 },
        // Ocultas
        { type: 'GALLERY', isActive: false, order: 10 },
      ]

    case 'LOCAL_BUSINESS':
    default:
      return getDefaultSections()
  }
}

/**
 * Retorna sections da store ou fallback para default
 */
export function getStoreSections(store: { sections: StoreSection[] | null; mode?: StoreMode | null }): StoreSection[] {
  if (store.sections) return store.sections
  return getDefaultSectionsForMode(store.mode || 'LOCAL_BUSINESS')
}

/**
 * Verifica se uma seção está ativa
 */
export function isSectionActive(
  sections: StoreSection[],
  type: SectionType
): boolean {
  const section = sections.find(s => s.type === type)
  return section?.isActive ?? false
}

/**
 * Retorna sections ordenadas e ativas
 */
export function getActiveSections(sections: StoreSection[]): StoreSection[] {
  return sections
    .filter(s => s.isActive)
    .sort((a, b) => a.order - b.order)
}

/**
 * Retorna configuração de uma seção específica
 */
export function getSectionConfig<T = Record<string, unknown>>(
  sections: StoreSection[],
  type: SectionType
): T | undefined {
  const section = sections.find(s => s.type === type)
  return section?.config as T | undefined
}
