import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Criar Minha Página',
  description: 'Configure a landing page do seu negócio local em poucos minutos.',
  robots: { index: false, follow: false },
}

interface LayoutProps {
  children: ReactNode
}

export default async function OnboardingLayout({ children }: LayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    redirect('/entrar')
  }

  return <>{children}</>
}
