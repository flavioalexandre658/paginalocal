import type { PlanType, BillingInterval, PlanFeatures, SubscriptionStatus } from '@/db/schema'

export type { PlanType, BillingInterval, PlanFeatures, SubscriptionStatus }

export interface IPlan {
  id: string
  name: string
  type: PlanType
  description: string | null
  monthlyPriceInCents: number
  yearlyPriceInCents: number
  stripeMonthlyPriceId: string | null
  stripeYearlyPriceId: string | null
  stripeProductId: string | null
  features: PlanFeatures
  isHighlighted: boolean
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface ISubscription {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  billingInterval: BillingInterval
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: Date | null
  aiRewritesUsedThisMonth: number
  aiRewritesResetAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ISubscriptionWithPlan extends ISubscription {
  plan: IPlan
}

export interface IUserPlanLimits {
  maxStores: number
  maxPhotosPerStore: number
  aiRewritesPerMonth: number | null
  aiRewritesUsed: number
  canUseCustomDomain: boolean
  canUseGmbSync: boolean
  canUseGmbAutoUpdate: boolean
  canUseUnifiedDashboard: boolean
  hasActiveSubscription: boolean
  planType: PlanType | null
  planName: string | null
}

export const FREE_TIER_LIMITS = {
  maxStores: 1,
  maxPhotosPerStore: 3,
  aiRewritesPerMonth: 0,
  customDomain: false,
  gmbSync: false,
  gmbAutoUpdate: false,
  unifiedDashboard: false,
} as const

export interface ICreateCheckoutSessionInput {
  planId: string
  billingInterval: BillingInterval
  storeSlug: string
  successUrl?: string
  cancelUrl?: string
}

export interface ICheckoutSessionResponse {
  checkoutUrl: string
  sessionId: string
}

export const PLAN_FEATURES_DISPLAY: Record<string, { label: string; description: string }> = {
  maxStores: {
    label: 'Negócios (Stores)',
    description: 'Quantidade de lojas que você pode criar',
  },
  customDomain: {
    label: 'Domínio',
    description: 'Tipo de domínio disponível',
  },
  maxPhotosPerStore: {
    label: 'Galeria de Fotos',
    description: 'Quantidade de fotos por loja',
  },
  aiRewritesPerMonth: {
    label: 'IA (Reescrita)',
    description: 'Reescritas de conteúdo com IA por mês',
  },
  gmbSync: {
    label: 'GMB Sync',
    description: 'Sincronização com Google Meu Negócio',
  },
  gmbAutoUpdate: {
    label: 'Atualização Automática',
    description: 'Atualização automática do GMB',
  },
  unifiedDashboard: {
    label: 'Dashboard Unificado',
    description: 'Painel único para todas as lojas',
  },
}
