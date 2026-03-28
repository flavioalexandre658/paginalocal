import { Metadata } from 'next'
import { headers } from 'next/headers'
import { db } from '@/db'
import { plan } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { PricingPageClient } from './_components/pricing-page-client'

export const metadata: Metadata = {
  title: 'Planos e Precos | Decolou',
  description: 'Escolha o plano ideal para ter o site do seu negocio local no topo do Google. SEO nativo, dominio proprio, WhatsApp integrado. A partir de R$ 59,90/mes.',
  openGraph: {
    title: 'Planos e Precos | Decolou',
    description: 'Site profissional com IA para seu negocio local. A partir de R$ 59,90/mes.',
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

export default async function PricingPage() {
  const [plans, session] = await Promise.all([
    getPlans(),
    auth.api.getSession({ headers: await headers() }),
  ])

  return <PricingPageClient plans={plans} isLoggedIn={!!session?.user?.id} />
}
