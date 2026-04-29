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

// Server Action `bootstrapSiteV2` é invocada deste segmento e precisa de
// até ~5min para a phase 1 + após-response (phases 2/3 via after()).
// `maxDuration` não pode ser exportado do arquivo "use server", então fica
// aqui no Route Segment Config — Server Actions herdam o limite do segmento
// que as invoca.
export const maxDuration = 300

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
