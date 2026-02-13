import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { ContatoPageClient } from './contato-page-client'

export const metadata: Metadata = {
  title: 'Contato | Fale com a Página Local',
  description: 'Entre em contato com a Página Local pelo WhatsApp ou email. Tire suas dúvidas sobre como ter o site do seu negócio local no topo do Google.',
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

export default async function ContatoPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  return (
    <ContatoPageClient 
      isLoggedIn={isLoggedIn} 
      hasSubscription={hasSubscription} 
    />
  )
}
