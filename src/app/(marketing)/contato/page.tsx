import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { ContatoPageClient } from './contato-page-client'

export const metadata: Metadata = {
  title: 'Contato | Fale com a Decolou',
  description: 'Entre em contato com a Decolou pelo WhatsApp ou email. Tire suas dúvidas sobre como ter o site do seu negócio local no topo do Google.',
}

export default async function ContatoPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <ContatoPageClient
      isLoggedIn={!!session?.user?.id}
    />
  )
}
