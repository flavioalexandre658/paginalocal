import { ReactNode, Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { PurchaseTracker } from '@/components/shared/purchase-tracker'

interface LayoutProps {
  children: ReactNode
}

export default async function PainelLayout({ children }: LayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    redirect('/entrar')
  }

  return (
    <>
      <Suspense fallback={null}>
        <PurchaseTracker />
      </Suspense>
      <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {children}
      </div>
    </>
  )
}
