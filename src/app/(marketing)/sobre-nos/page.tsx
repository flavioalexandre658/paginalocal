import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { SobreNosPageClient } from './sobre-nos-page-client'

export const metadata: Metadata = {
  title: 'Sobre o Decolou | Construtor de Sites com IA',
  description: 'Conheca o Decolou: criamos sites profissionais com inteligencia artificial em segundos. SEO otimizado, design responsivo e tudo que seu negocio precisa para crescer online.',
}

export default async function SobreNosPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <SobreNosPageClient
      isLoggedIn={!!session?.user?.id}
    />
  )
}
