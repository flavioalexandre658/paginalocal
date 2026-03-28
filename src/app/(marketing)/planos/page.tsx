import { Metadata } from 'next'
import { headers } from 'next/headers'
import { db } from '@/db'
import { plan, subscription } from '@/db/schema'
import { eq, asc, and, or } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { PricingPageClient } from './_components/pricing-page-client'

export const metadata: Metadata = {
  title: 'Planos e Precos | Decolou',
  description: 'Escolha o plano ideal para ter o site do seu negocio no topo do Google. SEO nativo, dominio proprio, WhatsApp integrado. A partir de R$ 59,90/mes.',
  openGraph: {
    title: 'Planos e Precos | Decolou',
    description: 'Site profissional com IA para seu negocio. A partir de R$ 59,90/mes.',
    type: 'website',
    url: 'https://decolou.com/planos',
  },
  alternates: {
    canonical: 'https://decolou.com/planos',
  },
}

async function getPlans() {
  return db
    .select()
    .from(plan)
    .where(eq(plan.isActive, true))
    .orderBy(asc(plan.sortOrder))
}

async function getUserPlanType(userId: string): Promise<string | null> {
  const activeSub = await db
    .select({ planType: plan.type })
    .from(subscription)
    .innerJoin(plan, eq(subscription.planId, plan.id))
    .where(
      and(
        eq(subscription.userId, userId),
        or(eq(subscription.status, 'ACTIVE'), eq(subscription.status, 'TRIALING'))
      )
    )
    .limit(1)

  return activeSub[0]?.planType ?? null
}

export default async function PricingPage() {
  const [plans, session] = await Promise.all([
    getPlans(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const isLoggedIn = !!session?.user?.id
  const currentPlanType = isLoggedIn && session.user.id
    ? await getUserPlanType(session.user.id)
    : null

  return (
    <PricingPageClient
      plans={plans}
      isLoggedIn={isLoggedIn}
      currentPlanType={currentPlanType}
    />
  )
}
