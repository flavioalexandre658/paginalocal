import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { LandingPage } from './(marketing)/_components/landing-page'

async function getUserHasSubscription(userId: string): Promise<boolean> {
  const [userSubscription] = await db
    .select({ id: subscription.id })
    .from(subscription)
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

  return !!userSubscription
}

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Página Local',
    url: 'https://paginalocal.com.br',
    description: 'Crie a landing page do seu negócio local em minutos. SEO otimizado para aparecer no Google e converter visitantes em clientes via WhatsApp.',
    inLanguage: 'pt-BR',
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Página Local',
    url: 'https://paginalocal.com.br',
    logo: 'https://paginalocal.com.br/assets/images/icon/favicon.ico',
    description: 'Plataforma de criação de sites otimizados para SEO local. Ajudamos negócios locais a aparecerem no topo do Google.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <LandingPage 
        isLoggedIn={isLoggedIn} 
        hasSubscription={hasSubscription} 
      />
    </>
  )
}
