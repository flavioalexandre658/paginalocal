import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { SobreNosPageClient } from './sobre-nos-page-client'

export const metadata: Metadata = {
  title: 'Sobre a Página Local | Sites Profissionais para Negócios Locais',
  description: 'Conheça a Página Local: nós ajudamos negócios locais a ter sites otimizados para aparecer no topo do Google e converter clientes pelo WhatsApp.',
}

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

export default async function SobreNosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  return (
    <SobreNosPageClient 
      isLoggedIn={isLoggedIn} 
      hasSubscription={hasSubscription} 
    />
  )
}
