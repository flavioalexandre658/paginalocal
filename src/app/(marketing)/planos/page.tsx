import { Metadata } from 'next'
import { headers } from 'next/headers'
import { db } from '@/db'
import { plan } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { PricingPageClient } from './_components/pricing-page-client'

export const metadata: Metadata = {
  title: 'Planos e Preços | Página Local',
  description: 'Escolha o plano ideal para o seu negócio local. Preços acessíveis e funcionalidades poderosas para atrair mais clientes.',
}

async function getPlans() {
  const plans = await db
    .select()
    .from(plan)
    .where(eq(plan.isActive, true))
    .orderBy(asc(plan.sortOrder))

  return plans
}

export default async function PricingPage() {
  const [plans, session] = await Promise.all([
    getPlans(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const isLoggedIn = !!session?.user?.id

  return <PricingPageClient plans={plans} isLoggedIn={isLoggedIn} />
}
