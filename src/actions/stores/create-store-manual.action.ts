'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, category, storePage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import {
  generateMarketingCopy,
  generateFallbackServices,
  generateFallbackFAQ,
  generateOptimizedSlug,
  type MarketingCopy,
  type ServiceItem,
  type FAQItem,
} from '@/lib/gemini'
import { generateInstitutionalPages } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'
import { checkCanCreateStore, getUserPlanContext } from '@/lib/plan-middleware'
import { addDomainToVercel } from '@/actions/vercel/add-domain'
import { notifyStoreActivated } from '@/lib/google-indexing'
import { revalidateSitemap, revalidateCategoryPages } from '@/lib/sitemap-revalidation'
import { generateCitySlug } from '@/lib/utils'

async function generateUniqueServiceSlugForStore(storeId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: service.id })
      .from(service)
      .where(and(eq(service.storeId, storeId), eq(service.slug, slug)))
      .limit(1)

    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

const createStoreManualSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  categoryId: z.string().uuid('Categoria inválida'),
  categoryName: z.string().min(1, 'Nome da categoria é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória').max(100),
  state: z.enum(BRAZILIAN_STATES, { message: 'UF inválida' }),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  neighborhoods: z.array(z.string()).optional(),
  differential: z.string().min(10, 'Descreva seu diferencial (mínimo 10 caracteres)').max(300),
  whatsapp: z.string().regex(/^\d{10,11}$/, 'WhatsApp inválido (apenas números, 10 ou 11 dígitos)'),
  mode: z.enum(['LOCAL_BUSINESS', 'PRODUCT_CATALOG', 'SERVICE_PRICING', 'HYBRID']).default('LOCAL_BUSINESS'),
})

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function truncate(str: string | undefined | null, maxLength: number): string | undefined {
  if (!str) return undefined
  return str.length > maxLength ? str.substring(0, maxLength) : str
}

function buildSeoH1(category: string, city: string, displayName: string): string {
  return `${category} em ${city} – ${displayName}`
}

function buildSeoSubtitle(category: string, city: string): string {
  return `${capitalizeWords(category)} em ${city} com atendimento rápido e de confiança`
}

function buildSeoDescription(displayName: string, category: string, city: string): string {
  return `${displayName} é referência em ${category.toLowerCase()} em ${city}, oferecendo serviços de qualidade com rapidez e atendimento de confiança.`
}

function fixOpeningHoursInFAQ(faq: FAQItem[], storeName: string): FAQItem[] {
  return faq.map(item => {
    const questionLower = item.question.toLowerCase()
    if (
      questionLower.includes('horário') ||
      questionLower.includes('horario') ||
      questionLower.includes('funcionamento') ||
      questionLower.includes('abre') ||
      questionLower.includes('fecha')
    ) {
      return {
        question: `Qual o horário de funcionamento da ${storeName}?`,
        answer: 'Entre em contato pelo WhatsApp ou telefone para confirmar nosso horário de funcionamento atualizado.',
      }
    }
    return item
  })
}

export const createStoreManualAction = authActionClient
  .schema(createStoreManualSchema)
  .action(async ({ parsedInput, ctx }) => {
    const storeCheck = await checkCanCreateStore(ctx.userId)
    if (!storeCheck.allowed) {
      throw new Error(storeCheck.reason || 'Limite de lojas atingido. Assine um plano para criar mais lojas.')
    }

    const planContext = await getUserPlanContext(ctx.userId)
    const shouldActivateStore = planContext.hasActiveSubscription

    console.log('[Manual Creation] Plan context:', {
      userId: ctx.userId,
      hasActiveSubscription: planContext.hasActiveSubscription,
      planType: planContext.planType,
      planName: planContext.planName,
      shouldActivateStore,
    })

    const {
      name,
      categoryId,
      categoryName,
      city,
      state,
      address: inputAddress,
      neighborhood,
      zipCode,
      latitude,
      longitude,
      neighborhoods: inputNeighborhoods,
      differential,
      whatsapp,
    } = parsedInput

    const displayName = name.trim()
    const categoryFormatted = categoryName === 'Outro' ? 'Serviços' : categoryName

    const baseSlug = generateOptimizedSlug(categoryFormatted, displayName, city)

    let slug = baseSlug
    let counter = 1

    while (true) {
      const existing = await db.query.store.findFirst({
        where: (s, { eq }) => eq(s.slug, slug),
      })
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const heroTitle = buildSeoH1(categoryFormatted, city, displayName)
    const heroSubtitle = buildSeoSubtitle(categoryFormatted, city)
    const aboutSection = buildSeoDescription(displayName, categoryFormatted, city)

    let marketingCopy: MarketingCopy | null = null
    try {
      marketingCopy = await generateMarketingCopy({
        businessName: displayName,
        category: categoryFormatted,
        city,
        state,
        googleAbout: differential,
      })
    } catch (error) {
      console.error('[Manual Creation] Erro ao gerar marketing copy:', error)
    }

    const seoTitle = truncate(
      `${categoryFormatted} em ${city} | ${displayName}`,
      70
    )
    const seoDescription = truncate(
      marketingCopy?.seoDescription || `${displayName} - ${categoryFormatted} em ${city}, ${state}. Entre em contato pelo WhatsApp!`,
      160
    )

    const finalServices: ServiceItem[] = (marketingCopy?.services && marketingCopy.services.length >= 4)
      ? marketingCopy.services.slice(0, 6)
      : generateFallbackServices(categoryFormatted)

    const rawFAQ: FAQItem[] = (marketingCopy?.faq && marketingCopy.faq.length >= 6)
      ? marketingCopy.faq.slice(0, 8)
      : generateFallbackFAQ(displayName, city, categoryFormatted)

    const finalFAQ = fixOpeningHoursInFAQ(rawFAQ, displayName)

    let finalNeighborhoods: string[] = []
    if (inputNeighborhoods && inputNeighborhoods.length > 0) {
      finalNeighborhoods = inputNeighborhoods
    } else if (latitude && longitude) {
      const { fetchNearbyNeighborhoods } = await import('@/lib/google-places')
      finalNeighborhoods = await fetchNearbyNeighborhoods(latitude, longitude, city)
    }
    if (finalNeighborhoods.length === 0 && marketingCopy?.neighborhoods && marketingCopy.neighborhoods.length > 0) {
      finalNeighborhoods = marketingCopy.neighborhoods
    }

    const address = inputAddress || [neighborhood, city, state].filter(Boolean).join(', ')

    const [newStore] = await db
      .insert(store)
      .values({
        userId: ctx.userId,
        name: displayName,
        slug,
        category: truncate(categoryFormatted, 100)!,
        categoryId,
        phone: whatsapp,
        whatsapp,
        address,
        city: truncate(city, 100)!,
        state: truncate(state, 2)!,
        zipCode: zipCode || undefined,
        latitude: latitude?.toString(),
        longitude: longitude?.toString(),
        creationSource: 'MANUAL_CREATION',
        heroTitle: truncate(marketingCopy?.heroTitle || heroTitle, 100),
        heroSubtitle: truncate(marketingCopy?.heroSubtitle || heroSubtitle, 200),
        description: marketingCopy?.aboutSection || aboutSection,
        seoTitle,
        seoDescription,
        faq: finalFAQ,
        neighborhoods: finalNeighborhoods,
        mode: parsedInput.mode,
        sections: null,
        templateId: 'default',
        templateConfig: null,
        termGender: marketingCopy?.termGender ?? 'FEMININE',
        termNumber: marketingCopy?.termNumber ?? 'SINGULAR',
        isActive: shouldActivateStore,
      })
      .returning()

    for (let i = 0; i < finalServices.length; i++) {
      const svc = finalServices[i]
      const svcSlug = await generateUniqueServiceSlugForStore(newStore.id, svc.name)
      await db
        .insert(service)
        .values({
          storeId: newStore.id,
          name: svc.name,
          slug: svcSlug,
          description: svc.description,
          seoTitle: svc.seoTitle ? svc.seoTitle.substring(0, 70) : null,
          seoDescription: svc.seoDescription ? svc.seoDescription.substring(0, 160) : null,
          longDescription: svc.longDescription || null,
          iconName: svc.iconName || null,
          position: i + 1,
          isActive: true,
        })
    }

    let subdomainCreated = false
    const subdomain = `${newStore.slug}.paginalocal.com.br`
    try {
      const domainResult = await addDomainToVercel(subdomain)
      subdomainCreated = domainResult.success
      if (!domainResult.success) {
        console.error('[Manual Creation] Erro ao criar subdomínio na Vercel:', domainResult.error)
      }
    } catch (error) {
      console.error('[Manual Creation] Erro ao criar subdomínio na Vercel:', error)
    }

    // ===== Generate institutional pages =====
    let pagesGenerated = false
    try {
      const aiPageInput: MarketingCopyInput = {
        businessName: newStore.name,
        category: newStore.category,
        city: newStore.city,
        state: newStore.state,
        googleAbout: differential || undefined,
      }

      const institutionalPages = await generateInstitutionalPages(aiPageInput)

      await db.insert(storePage).values([
        {
          storeId: newStore.id,
          type: 'ABOUT' as const,
          slug: 'sobre-nos',
          title: institutionalPages.about.title,
          content: institutionalPages.about.content,
          seoTitle: institutionalPages.about.seoTitle,
          seoDescription: institutionalPages.about.seoDescription,
        },
        {
          storeId: newStore.id,
          type: 'CONTACT' as const,
          slug: 'contato',
          title: institutionalPages.contact.title,
          content: institutionalPages.contact.content,
          seoTitle: institutionalPages.contact.seoTitle,
          seoDescription: institutionalPages.contact.seoDescription,
        },
      ])

      pagesGenerated = true
      console.log(`[Manual Creation] Páginas institucionais geradas para "${newStore.name}"`)
    } catch (error) {
      console.error('[Manual Creation] Erro ao gerar páginas institucionais:', error)
    }

    const pageSlugs = pagesGenerated ? ['sobre-nos', 'contato'] : undefined
    if (shouldActivateStore) {
      notifyStoreActivated(newStore.slug, newStore.customDomain, undefined, pageSlugs).catch((error) => {
        console.error('[Manual Creation] Erro ao notificar Google Indexing API:', error)
      })

      // Revalida o sitemap e páginas de categoria
      await revalidateSitemap()

      // Busca o slug da categoria e revalida páginas de categoria/cidade
      const [categoryData] = await db
        .select({ slug: category.slug })
        .from(category)
        .where(eq(category.name, newStore.category))
        .limit(1)

      if (categoryData) {
        await revalidateCategoryPages(categoryData.slug, generateCitySlug(newStore.city))
      }
    }

    return {
      store: newStore,
      slug: newStore.slug,
      name: newStore.name,
      marketingGenerated: !!marketingCopy,
      servicesGenerated: finalServices.length,
      faqGenerated: finalFAQ.length,
      neighborhoodsGenerated: finalNeighborhoods.length,
      subdomainCreated,
    }
  })
