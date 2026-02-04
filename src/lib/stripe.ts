import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

export const PLANS_CONFIG = {
  ESSENTIAL: {
    name: 'Essencial',
    type: 'ESSENTIAL' as const,
    description: 'Ideal para pequenos negócios que estão começando',
    monthlyPriceInCents: 5990,
    yearlyPriceInCents: 59700,
    isHighlighted: true,
    sortOrder: 1,
    features: {
      maxStores: 1,
      maxPhotosPerStore: 6,
      aiRewritesPerMonth: 2,
      customDomain: false,
      gmbSync: true,
      gmbAutoUpdate: false,
      unifiedDashboard: false,
    },
  },
  PRO: {
    name: 'Pro',
    type: 'PRO' as const,
    description: 'Para negócios que querem crescer com recursos avançados',
    monthlyPriceInCents: 9990,
    yearlyPriceInCents: 89700,
    isHighlighted: false,
    sortOrder: 2,
    features: {
      maxStores: 1,
      maxPhotosPerStore: 20,
      aiRewritesPerMonth: null,
      customDomain: true,
      gmbSync: true,
      gmbAutoUpdate: true,
      unifiedDashboard: false,
    },
  },
  AGENCY: {
    name: 'Agência',
    type: 'AGENCY' as const,
    description: 'Para agências e profissionais que gerenciam múltiplos negócios',
    monthlyPriceInCents: 39790,
    yearlyPriceInCents: 397000,
    isHighlighted: false,
    sortOrder: 3,
    features: {
      maxStores: 10,
      maxPhotosPerStore: 50,
      aiRewritesPerMonth: null,
      customDomain: true,
      gmbSync: true,
      gmbAutoUpdate: true,
      unifiedDashboard: true,
    },
  },
} as const

export type PlanConfigKey = keyof typeof PLANS_CONFIG
