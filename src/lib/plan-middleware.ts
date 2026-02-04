import { db } from '@/db'
import { subscription, plan, store } from '@/db/schema'
import { eq, and, or, count } from 'drizzle-orm'
import type { PlanFeatures } from '@/db/schema'

export const FREE_TIER_LIMITS = {
  maxStores: 1,
  maxPhotosPerStore: 3,
  aiRewritesPerMonth: 0,
  customDomain: false,
  gmbSync: false,
  gmbAutoUpdate: false,
  unifiedDashboard: false,
} as const

export interface UserPlanContext {
  hasActiveSubscription: boolean
  planType: string | null
  planName: string | null
  features: PlanFeatures
  aiRewritesUsed: number
  aiRewritesLimit: number | null
}

export async function getUserPlanContext(userId: string): Promise<UserPlanContext> {
  const [userSubscription] = await db
    .select({
      subscription: subscription,
      plan: plan,
    })
    .from(subscription)
    .innerJoin(plan, eq(subscription.planId, plan.id))
    .where(
      and(
        eq(subscription.userId, userId),
        or(
          eq(subscription.status, 'ACTIVE'),
          eq(subscription.status, 'TRIALING')
        )
      )
    )
    .limit(1)

  if (!userSubscription) {
    return {
      hasActiveSubscription: false,
      planType: null,
      planName: 'Gratuito',
      features: FREE_TIER_LIMITS,
      aiRewritesUsed: 0,
      aiRewritesLimit: FREE_TIER_LIMITS.aiRewritesPerMonth,
    }
  }

  return {
    hasActiveSubscription: true,
    planType: userSubscription.plan.type,
    planName: userSubscription.plan.name,
    features: userSubscription.plan.features,
    aiRewritesUsed: userSubscription.subscription.aiRewritesUsedThisMonth,
    aiRewritesLimit: userSubscription.plan.features.aiRewritesPerMonth,
  }
}

export async function checkCanCreateStore(userId: string): Promise<{ allowed: boolean; reason?: string; requiresSubscription?: boolean }> {
  const planContext = await getUserPlanContext(userId)

  const [storeCount] = await db
    .select({ count: count() })
    .from(store)
    .where(eq(store.userId, userId))

  const currentStoreCount = storeCount?.count || 0

  if (!planContext.hasActiveSubscription) {
    if (currentStoreCount >= FREE_TIER_LIMITS.maxStores) {
      return {
        allowed: false,
        reason: `Você já possui ${FREE_TIER_LIMITS.maxStores} loja(s) no plano gratuito. Assine um plano para criar mais lojas.`,
        requiresSubscription: true,
      }
    }
    return { allowed: true }
  }

  const maxStores = planContext.features.maxStores

  if (currentStoreCount >= maxStores) {
    return {
      allowed: false,
      reason: `Seu plano ${planContext.planName} permite até ${maxStores} loja(s). Faça upgrade para criar mais.`,
    }
  }

  return { allowed: true }
}

export async function checkCanActivateStore(userId: string): Promise<{ allowed: boolean; reason?: string; requiresSubscription?: boolean }> {
  const planContext = await getUserPlanContext(userId)

  if (!planContext.hasActiveSubscription) {
    return {
      allowed: false,
      reason: 'Você precisa de uma assinatura ativa para publicar sua loja.',
      requiresSubscription: true,
    }
  }

  return { allowed: true }
}

export async function checkCanUseAiRewrite(userId: string): Promise<{ allowed: boolean; reason?: string; remaining?: number; requiresSubscription?: boolean }> {
  const planContext = await getUserPlanContext(userId)

  if (!planContext.hasActiveSubscription) {
    return {
      allowed: false,
      reason: 'A reescrita com IA está disponível apenas para assinantes. Assine um plano para usar este recurso.',
      remaining: 0,
      requiresSubscription: true,
    }
  }

  if (planContext.aiRewritesLimit === null) {
    return { allowed: true, remaining: undefined }
  }

  const remaining = Math.max(0, planContext.aiRewritesLimit - planContext.aiRewritesUsed)

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `Você atingiu o limite de ${planContext.aiRewritesLimit} reescritas com IA este mês. O limite será renovado no próximo mês.`,
      remaining: 0,
    }
  }

  return { allowed: true, remaining }
}

export async function checkCanUploadPhoto(
  userId: string,
  storeId: string,
  currentPhotoCount: number
): Promise<{ allowed: boolean; reason?: string; remaining?: number; requiresSubscription?: boolean }> {
  const planContext = await getUserPlanContext(userId)

  const maxPhotos = planContext.features.maxPhotosPerStore
  const remaining = Math.max(0, maxPhotos - currentPhotoCount)

  if (currentPhotoCount >= maxPhotos) {
    if (!planContext.hasActiveSubscription) {
      return {
        allowed: false,
        reason: `O plano gratuito permite até ${maxPhotos} fotos. Assine um plano para adicionar mais.`,
        remaining: 0,
        requiresSubscription: true,
      }
    }
    return {
      allowed: false,
      reason: `Seu plano ${planContext.planName} permite até ${maxPhotos} fotos por loja. Faça upgrade para adicionar mais.`,
      remaining: 0,
    }
  }

  return { allowed: true, remaining }
}

export async function checkCanUseCustomDomain(userId: string): Promise<{ allowed: boolean; reason?: string; requiresSubscription?: boolean }> {
  const planContext = await getUserPlanContext(userId)

  if (!planContext.hasActiveSubscription) {
    return {
      allowed: false,
      reason: 'Domínio próprio está disponível apenas para assinantes do plano Pro ou superior.',
      requiresSubscription: true,
    }
  }

  if (!planContext.features.customDomain) {
    return {
      allowed: false,
      reason: `Seu plano ${planContext.planName} não inclui domínio próprio. Faça upgrade para o plano Pro ou superior.`,
    }
  }

  return { allowed: true }
}

export async function checkCanUseGmbSync(userId: string): Promise<{ allowed: boolean; reason?: string; requiresSubscription?: boolean }> {
  const planContext = await getUserPlanContext(userId)

  if (!planContext.hasActiveSubscription) {
    return {
      allowed: false,
      reason: 'Sincronização com Google Meu Negócio está disponível apenas para assinantes.',
      requiresSubscription: true,
    }
  }

  if (!planContext.features.gmbSync) {
    return {
      allowed: false,
      reason: `Seu plano ${planContext.planName} não inclui sincronização com Google Meu Negócio.`,
    }
  }

  return { allowed: true }
}

export async function requireActiveSubscription(userId: string): Promise<void> {
  const planContext = await getUserPlanContext(userId)

  if (!planContext.hasActiveSubscription) {
    throw new Error('Você precisa de uma assinatura ativa para realizar esta ação')
  }
}

export async function getUserStoreCount(userId: string): Promise<number> {
  const [storeCount] = await db
    .select({ count: count() })
    .from(store)
    .where(eq(store.userId, userId))

  return storeCount?.count || 0
}

export async function canUserAccessFeature(
  userId: string,
  feature: 'customDomain' | 'gmbSync' | 'gmbAutoUpdate' | 'unifiedDashboard' | 'aiRewrite'
): Promise<boolean> {
  const planContext = await getUserPlanContext(userId)

  if (!planContext.hasActiveSubscription) {
    return false
  }

  switch (feature) {
    case 'customDomain':
      return planContext.features.customDomain
    case 'gmbSync':
      return planContext.features.gmbSync
    case 'gmbAutoUpdate':
      return planContext.features.gmbAutoUpdate
    case 'unifiedDashboard':
      return planContext.features.unifiedDashboard
    case 'aiRewrite':
      return planContext.aiRewritesLimit === null ||
        (planContext.aiRewritesLimit > 0 && planContext.aiRewritesUsed < planContext.aiRewritesLimit)
    default:
      return false
  }
}
