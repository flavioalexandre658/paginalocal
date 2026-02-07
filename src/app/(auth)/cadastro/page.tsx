import { Metadata } from 'next'
import { AuthCard } from '@/components/auth/auth-card'
import { SignUpForm } from './_components/sign-up-form'

export const metadata: Metadata = {
  title: 'Criar Conta',
}

interface SignUpPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { q } = await searchParams
  const isTransferFlow = q === 'transferir'

  return (
    <AuthCard
      title={isTransferFlow ? 'Crie sua conta' : 'Criar conta'}
      description={
        isTransferFlow
          ? 'Cadastre-se para receber a sua loja'
          : 'Preencha os dados abaixo para criar sua conta'
      }
      footer={{
        text: 'Já tem uma conta?',
        linkText: 'Entrar',
        linkHref: '/entrar',
      }}
    >
      <SignUpForm />
    </AuthCard>
  )
}
