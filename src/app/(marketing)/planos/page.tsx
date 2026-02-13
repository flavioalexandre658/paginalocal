import { Metadata } from 'next'
import { headers } from 'next/headers'
import { db } from '@/db'
import { plan } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { PricingPageClient } from './_components/pricing-page-client'

export const metadata: Metadata = {
  title: 'Planos e Preços | Site para Negócio Local',
  description: 'Escolha o plano ideal para ter o site do seu negócio local no topo do Google. SEO nativo, domínio próprio, WhatsApp integrado. A partir de R$29/mês.',
  keywords: [
    'planos página local',
    'preços site negócio local',
    'quanto custa site para empresa',
    'site para negócio local preço',
    'site profissional negócio local',
    'site otimizado SEO preço',
  ],
  openGraph: {
    title: 'Planos e Preços | Site para Negócio Local | Página Local',
    description: 'Tenha o site do seu negócio local a partir de R$29/mês. SEO otimizado para aparecer no topo do Google.',
    type: 'website',
    url: 'https://www.paginalocal.com.br/planos',
    images: [
      {
        url: 'https://paginalocal.com.br/assets/images/seo/previa_social.jpg',
        width: 1200,
        height: 630,
        alt: 'Página Local - Seu negócio no topo do Google',
        type: 'image/jpeg',
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
