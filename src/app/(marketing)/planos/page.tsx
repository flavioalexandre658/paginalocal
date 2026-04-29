import { Metadata } from 'next'
import { headers } from 'next/headers'
import { db } from '@/db'
import { plan, subscription } from '@/db/schema'
import { eq, asc, and, or } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { PricingPageClient } from './_components/pricing-page-client'
import { buildPlatformMetadata } from '@/lib/platform-seo'

export const metadata: Metadata = buildPlatformMetadata({
  path: '/planos',
  title: 'Planos da Decolou — Construtor de sites com IA',
  description:
    'Escolha o plano ideal para construir, lançar e expandir seu negócio com IA. Sites profissionais em 30 segundos, SEO nativo e domínio próprio.',
  keywords: [
    'planos Decolou',
    'preços construtor de sites com IA',
    'plano gratuito IA',
    'assinatura plataforma de IA negócios',
    'preço criar site com IA',
  ],
})

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
