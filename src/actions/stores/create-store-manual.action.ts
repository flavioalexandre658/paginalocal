'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { generateSlug } from '@/lib/utils'
import { generateOptimizedSlug } from '@/lib/gemini'
import { checkCanCreateStore, getUserPlanContext } from '@/lib/plan-middleware'
import { addDomainToVercel } from '@/actions/vercel/add-domain'
import { inferSiteType } from '@/lib/infer-site-type'

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  'BR',
] as const

const createStoreManualSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  businessType: z.string().min(1, 'Tipo de negócio é obrigatório').max(100),
  categoryId: z.string().uuid('Categoria inválida').optional(),
  categoryName: z.string().min(1, 'Nome da categoria é obrigatório').optional(),
  city: z.string().min(2, 'Cidade é obrigatória').max(100),
  state: z.enum(BRAZILIAN_STATES, { message: 'UF inválida' }),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  differential: z.string().max(2000).optional(),
  whatsapp: z.string().regex(/^\d{10,11}$/, 'WhatsApp inválido (apenas números, 10 ou 11 dígitos)'),
  monthlyRevenue: z.string().max(30).optional(),
  mode: z.enum(['LOCAL_BUSINESS', 'PRODUCT_CATALOG', 'SERVICE_PRICING', 'HYBRID']).optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  termGender: z.enum(['MASCULINE', 'FEMININE']).optional(),
  termNumber: z.enum(['SINGULAR', 'PLURAL']).optional(),
})

function truncate(str: string | undefined | null, maxLength: number): string | undefined {
  if (!str) return undefined
  return str.length > maxLength ? str.substring(0, maxLength) : str
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

    const {
      name,
      businessType,
      categoryId: inputCategoryId,
      categoryName: inputCategoryName,
      city,
      state,
      address: inputAddress,
      neighborhood,
      zipCode,
      latitude,
      longitude,
      differential: inputDifferential,
      whatsapp,
      monthlyRevenue,
      primaryColor,
      secondaryColor,
      accentColor,
      termGender: inputTermGender,
      termNumber: inputTermNumber,
    } = parsedInput

    const displayName = name.trim()

    // Classificar categoria se nao fornecida
    let categoryId = inputCategoryId
    let categoryName = inputCategoryName || businessType

    if (!categoryId && businessType) {
      const { classifyBusinessCategory } = await import('@/lib/ai')
      const classifiedCategory = await classifyBusinessCategory({
        businessName: `${displayName} - ${businessType}`,
        primaryType: businessType,
      })
      if (classifiedCategory) {
        const matchedCategory = await db.query.category.findFirst({
          where: (c, { eq }) => eq(c.name, classifiedCategory),
        })
        if (matchedCategory) {
          categoryId = matchedCategory.id
          categoryName = matchedCategory.name
        }
      }
      if (!categoryId) {
        const fallbackCategory = await db.query.category.findFirst({
          where: (c, { eq }) => eq(c.slug, 'outro'),
        })
        categoryId = fallbackCategory?.id
        categoryName = categoryName || 'Outro'
      }
    }

    const categoryFormatted = categoryName === 'Outro' ? businessType || 'Serviços' : (categoryName || businessType)
    const differential = inputDifferential || categoryFormatted

    // Gerar slug unico
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

    const siteType = parsedInput.mode ?? inferSiteType(categoryFormatted, displayName).siteType
    const address = inputAddress || [neighborhood, city, state].filter(Boolean).join(', ')

    // Criar store com dados basicos — conteudo sera gerado pelo blueprint V2
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
        monthlyRevenue: monthlyRevenue || null,
        heroTitle: `${categoryFormatted} em ${city} – ${displayName}`,
        heroSubtitle: `${displayName} — ${categoryFormatted} em ${city}, ${state}`,
        description: `${displayName} é referência em ${categoryFormatted.toLowerCase()} em ${city}.`,
        seoTitle: truncate(`${categoryFormatted} em ${city} | ${displayName}`, 70),
        seoDescription: truncate(`${displayName} - ${categoryFormatted} em ${city}, ${state}. Entre em contato pelo WhatsApp!`, 160),
        mode: siteType,
        differential,
        primaryColor: primaryColor ?? undefined,
        secondaryColor: secondaryColor ?? undefined,
        accentColor: accentColor ?? undefined,
        termGender: inputTermGender ?? 'FEMININE',
        termNumber: inputTermNumber ?? 'SINGULAR',
        isActive: false,
      })
      .returning()

    // Criar subdominio na Vercel
    let subdomainCreated = false
    const subdomain = `${newStore.slug}.decolou.com`
    try {
      const domainResult = await addDomainToVercel(subdomain)
      subdomainCreated = domainResult.success
      if (!domainResult.success) {
        console.error('[Manual Creation] Erro subdominio:', domainResult.error)
      }
    } catch (error) {
      console.error('[Manual Creation] Erro subdominio:', error)
    }

    return {
      store: newStore,
      slug: newStore.slug,
      name: newStore.name,
      subdomainCreated,
      isActive: shouldActivateStore,
    }
  })
