import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { SobreNosPageClient } from './sobre-nos-page-client'
import { buildPlatformMetadata } from '@/lib/platform-seo'

export const metadata: Metadata = buildPlatformMetadata({
  path: '/sobre-nos',
  title: 'Sobre a Decolou — Plataforma all-in-one de IA para negócios',
  description:
    'Conheça a Decolou: a solução completa de IA para construção de negócios. Lance um site, conquiste clientes e expanda mais rápido — fique online em 30 segundos.',
  keywords: [
    'quem somos Decolou',
    'sobre construtor de sites com IA',
    'fundadores Decolou',
    'IA para empreendedores',
  ],
})

export default async function SobreNosPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <SobreNosPageClient
      isLoggedIn={!!session?.user?.id}
    />
  )
}
