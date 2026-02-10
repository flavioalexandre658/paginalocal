import { Metadata } from 'next'
import { headers } from 'next/headers'
import { db } from '@/db'
import { plan } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { PricingPageClient } from './_components/pricing-page-client'

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Escolha o plano ideal para criar o site do seu negócio local. A partir de R$29/mês com domínio próprio, SEO otimizado e suporte. Cancele quando quiser.',
  keywords: [
    'planos página local',
    'preços site negócio local',
    'quanto custa site para empresa',
    'site para negócio local preço',
    'landing page preço',
  ],
  openGraph: {
    title: 'Planos e Preços | Página Local',
    description: 'Crie o site do seu negócio local a partir de R$29/mês. SEO otimizado para aparecer no Google.',
    type: 'website',
    url: 'https://www.paginalocal.com.br/planos',
    images: [
      {
        url: 'https://paginalocal.com.br/assets/images/seo/previa_social.png',
        width: 1200,
        height: 630,
        alt: 'Página Local - Sua empresa no Google nas primeiras posições',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.paginalocal.com.br/planos',
  },
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
