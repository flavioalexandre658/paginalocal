import { Metadata } from 'next'
import { AuthCard } from '@/components/auth/auth-card'
import { SignUpForm } from './_components/sign-up-form'

export const metadata: Metadata = {
  title: 'Criar Conta',
}

interface SignUpPageProps {
  searchParams: Promise<{ q?: string; p?: string }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { q, p } = await searchParams
  const isTransferFlow = q === 'transferir'
  const hasTransferPlan = isTransferFlow && !!p

  return (
    <AuthCard
      title="Crie sua conta gratis"
      description={
        hasTransferPlan
          ? 'Cadastre-se para ativar seu plano e receber sua loja.'
          : 'Crie em 30 segundos. Sem cartao de credito.'
      }
      footer={{
        text: 'Ja tem uma conta?',
        linkText: 'Entrar',
        linkHref: '/entrar',
      }}
    >
      <SignUpForm />
    </AuthCard>
  )
}
