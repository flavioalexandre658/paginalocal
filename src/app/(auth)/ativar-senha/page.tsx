import { Suspense } from 'react'
import { Metadata } from 'next'
import { AuthCard } from '@/components/auth/auth-card'
import { ActivateForm } from './_components/activate-form'

export const metadata: Metadata = {
  title: 'Ativar Conta',
  robots: { index: false, follow: false },
}

export default function AtivarSenhaPage() {
  return (
    <AuthCard
      title="Crie sua senha"
      description="Defina uma senha para acessar seu painel"
      footer={{
        text: 'Já tem uma conta?',
        linkText: 'Entrar',
        linkHref: '/entrar',
      }}
    >
      <Suspense fallback={<div className="h-40" />}>
        <ActivateForm />
      </Suspense>
    </AuthCard>
  )
}
