import type { StoreSection, SectionType } from '@/db/schema'

/**
 * Gera sections default baseado na estrutura atual das lojas
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
 * Retorna sections da store ou fallback para default
 */
export function getStoreSections(store: { sections: StoreSection[] | null }): StoreSection[] {
  return store.sections || getDefaultSections()
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
