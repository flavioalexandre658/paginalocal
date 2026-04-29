import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { ContatoPageClient } from './contato-page-client'
import { buildPlatformMetadata } from '@/lib/platform-seo'

export const metadata: Metadata = buildPlatformMetadata({
  path: '/contato',
  title: 'Fale com a Decolou — Suporte, parcerias e dúvidas',
  description:
    'Entre em contato com a Decolou pelo WhatsApp ou email. Tire suas dúvidas sobre o construtor de sites e negócios com IA.',
  keywords: [
    'contato Decolou WhatsApp',
    'email Decolou',
    'suporte plataforma IA',
  ],
})

export default async function ContatoPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <ContatoPageClient
      isLoggedIn={!!session?.user?.id}
    />
  )
}
